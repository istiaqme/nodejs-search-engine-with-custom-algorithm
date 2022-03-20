/* 
    1. Axios will fetch the webpage
    2. Cheerio will extract data
    3. Data save
*/

const axios = require('axios');
const cheerio = require('cheerio');
const Webpage = require('../models/Webpage');
const ScrapeQueue = require('../models/ScrapeQueue');

async function scrape(req, res){
    let { submitted } = req.body;
    console.log(submitted)
    if(!submitted.startsWith('http')){
        res.send('Please submit a qualified url');
    }
    let scrapedData = await scrapeSingleUrl(submitted);
    let newWebpage = new Webpage({
        url : submitted,
        ...scrapedData
    })
    await newWebpage.save();

    scrapedData.anchors.map(async (element, index) => {
        //console.log(element)
        let newQueueItem = new ScrapeQueue({
            url : element.href,
            scrapeStatus : "No"
        })
        await newQueueItem.save();
    })
    res.send('Data Saved');
}


async function scrapeSingleUrl(link){
    try {
        let processedUrl = (new URL(link));
        let { hostname, pathname, protocol } = processedUrl;
        let { data } = await axios.get(link);
        const $ = cheerio.load(data);
        /* head - meta[name="description"],  meta[name="keywords"]*/
        let structuredData = {};
        structuredData.title = $('title').text();
        structuredData.keywords = [];
        $('meta').map((index, element) => {
            if($(element).attr('name') === "keywords"){
                structuredData.keywords = $(element).attr('content').split(',');
            }
            if($(element).attr('name') === "description"){
                structuredData.description = $(element).attr('content');
            }
        });
        /* h tag extraction */
        structuredData.headings = [];
        $('h1, h2, h3, h4, h5, h6').map((index, element) => {
            structuredData.headings.push({
                tag : element.name,
                text : $(element).text(),
                html : $(element).html()
            })
        });
        /* p tag extraction */
        structuredData.paragraphs = [];
        $('p').map((index, element) => {
            structuredData.paragraphs.push({
                text : $(element).text(),
                html : $(element).html()
            })
        });

        /* p tag extraction */
        structuredData.listItems = [];
        $('li').map((index, element) => {
            structuredData.listItems.push({
                text : $(element).text(),
                html : $(element).html()
            })
        });

        /* 
            <a href="https://domain.com/...">
            <a href="/something">
            <a href="something"
        
        */

        /* a tag extraction */
        structuredData.anchors = [];
        console.log('A Length', $('a').length)
        $('a').map((index, element) => {
            console.log($(element).attr('href'))
            let hrefValue = $(element).attr('href');
            if(!hrefValue.startsWith('http')){
                if(hrefValue.startsWith('/')){
                    hrefValue = `${protocol}//${hostname}${hrefValue}`;
                }
                else{
                    hrefValue = `${protocol}//${hostname}/${hrefValue}`;
                }
            }
            
            structuredData.anchors.push({
                text : $(element).text(),
                href : hrefValue,
                html : $(element).html()
            })
        });


        /* images tag extraction */
        structuredData.images = [];
        $('img').map((index, element) => {
            structuredData.images.push({
                src : $(element).attr('src'),
                alt : $(element).attr('alt').replace(/-/g, ' ')
            })
        });
        console.log(structuredData);
        return structuredData;

    }
    catch(e){
        console.log(e)
    }
}


module.exports = { scrape }


var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const passmarked = require('passmarked');
var mongoose = require('mongoose');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));
app.use(cookieParser());

//Gtmetrix API Config
const EMAIL = 'pamo@wmail.club';
const APIKEY = 'PM_2f53e970720911e7bfd8797c6d1b46895961501076943239';
const BROWSER = 3;
const fs = require('fs');

// APIs
mongoose.connect('mongodb://localhost:27017/bookshop');
//mongoose.connect('mongodb://test:12345@ds151452.mlab.com:51452/bookshop');

var db = mongoose.connection;
db.on('error',console.error.bind(console,'#Monodd-Connection error'));

// ----> Setup session ---- //
app.use(session({
    secret: 'mySecrett',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    cookie : {maxAge : 1000*60*60*24*2},
    store: new mongoStore({
        mongooseConnection : db,
        ttl: 24 * 3600 // time period in seconds
    })
}));
// SAVE SESSION CART API
app.post('/cart', function(req, res){
    var cart = req.body;
    req.session.cart = cart;
    req.session.save(function(err){
    if(err){
    console.log('saving to cart error');
    }
    res.json(req.session.cart);
    })
});

// GET SESSION CART API
app.get('/cart', function(req, res){
    if(typeof req.session.cart !=='undefined'){
    res.json(req.session.cart);
    }
});

//---- End session -------- //

var Books = require('./models/books.js');

//---->>> POST BOOKS <<<-----

app.post('/books', function(req, res){
     var book = req.body;
     Books.create(book, function(err, books){
       if(err){
         console.log('saving book error');
     }
     res.json(books);
     })
});

//----->>>> GET BOOKS <<<---------

app.get('/books', function(req, res){
    Books.find(function(err, books){
      if(err){
        console.log('getting book list error');
      }
    res.json(books)
    })
});

//---->>> DELETE BOOKS <<<------

app.delete('/books/:_id', function(req, res){
  var query = {_id: req.params._id};
  Books.remove(query, function(err, books){
      if(err){
        console.log('remove book error');
      }
      res.json(books);
    })
});
//---->>> UPDATE BOOKS <<<------

app.put('/books/:_id', function(req, res){
    var book = req.body;
    var query = req.params._id;

    var update = {'$set':{

         title:book.title,
         description:book.description,
         image:book.image,
         price:book.price
     }
     };
     // When true returns the updated document
     var options = {new: true};
     Books.findOneAndUpdate(query, update,
    options, function(err, books){
     if(err){
       console.log('update book error');
     }
     res.json(books);
     })
})
// END APIs

//Get books images API
app.get('/images',function(req,res){
    const imgFolder = __dirname + '/public/images';
    //require file system
    //read all files in the directory
    fs.readdir(imgFolder,function(err,files){
      if(err){
      return  console.error(err);
      }
      //return an empty array
      const fileArr = [];
      files.forEach(function(file){
        fileArr.push({name : file})
      })
      res.json(fileArr);
    });
});

// url test api

var Tests = require('./models/tests.js');

app.get('/testUrl/', function(req, res){

  var targeturl = req.query.url;
  //var MyStrategy = req.query.strategy;
  var testResult ={};
  console.log('url from server',targeturl);
//  console.log('strategy',MyStrategy);

//Google pagespeed API call
var https = require('https'),
    key = 'AIzaSyCXzfS8daIlAWPsDNHEdjVdf8DvErHPU6U',
    url = targeturl,
    screenshot=true,
    desktopStrategy = 'desktop';
    mobileStrategy = 'mobile';

    getDesktopResult();



function getDesktopResult(){
  https.get({
  host: 'www.googleapis.com',
  path: '/pagespeedonline/v1/runPagespeed?url=' + encodeURIComponent(url) +
  '&key='+key+'&strategy='+desktopStrategy+'&screenshot='+screenshot
  }, function(resPageSpeed) {
  var json = "";
  resPageSpeed.on('data', function(d) {
  json += d;
  });
  resPageSpeed.on('end', function(){
  json = JSON.parse(json);

//Converting screenshot to 64bit image
      var id = Math.floor(Math.random() * 200000000);
      const imgPath = __dirname + '/public/images/'+'screenshot'+id+'.jpeg';
      var newScreenshot = json.screenshot.data.replace(/_/g,'/').replace(/-/g,'+');
     fs.writeFile (imgPath, newScreenshot,'base64', function(err){
       console.log(err);
     });
      var imgSrc = 'screenshot'+id+'.jpeg' ;

          var  desktop1 = {
               title: json.title,
               targeturl : json.id,
               score : json.score ,
               htmlResponseBytes : json.pageStats.htmlResponseBytes ,
               cssResponseBytes : json.pageStats.cssResponseBytes,
               imageResponseBytes : json.pageStats.imageResponseBytes,
               javascriptResponseBytes : json.pageStats.javascriptResponseBytes,
               LandingPageRedirectsName : json.formattedResults.ruleResults.AvoidLandingPageRedirects.localizedRuleName,
               LandingPageRedirectsImpact : json.formattedResults.ruleResults.AvoidLandingPageRedirects.ruleImpact.toFixed(2),
               LandingPageRedirectsSummary :json.formattedResults.ruleResults.AvoidLandingPageRedirects.urlBlocks[0].header.format,
               EnableGzipCompressionName : json.formattedResults.ruleResults.EnableGzipCompression.localizedRuleName,
               EnableGzipCompressionImpact : json.formattedResults.ruleResults.EnableGzipCompression.ruleImpact.toFixed(2),
               EnableGzipCompressionSummary : json.formattedResults.ruleResults.EnableGzipCompression.urlBlocks[0].header.format,
               LeverageBrowserCachingName : json.formattedResults.ruleResults.LeverageBrowserCaching.localizedRuleName,
               LeverageBrowserCachingImpact : json.formattedResults.ruleResults.LeverageBrowserCaching.ruleImpact.toFixed(2),
               LeverageBrowserCachingSummary : json.formattedResults.ruleResults.LeverageBrowserCaching.urlBlocks[0].header.format,
               ServerResponseTimeName : json.formattedResults.ruleResults.MainResourceServerResponseTime.localizedRuleName,
               ServerResponseTimeImpact : json.formattedResults.ruleResults.MainResourceServerResponseTime.ruleImpact.toFixed(2),
               ServerResponseTimeSummary : json.formattedResults.ruleResults.MainResourceServerResponseTime.urlBlocks[0].header.format,
               MinifyCssName : json.formattedResults.ruleResults.MinifyCss.localizedRuleName,
               MinifyCssImpact : json.formattedResults.ruleResults.MinifyCss.ruleImpact.toFixed(2),
               MinifyCssSummary : json.formattedResults.ruleResults.MinifyCss.urlBlocks[0].header.format,
               MinifyHTMLName : json.formattedResults.ruleResults.MinifyHTML.localizedRuleName,
               MinifyHTMLImpact : json.formattedResults.ruleResults.MinifyHTML.ruleImpact.toFixed(2),
               MinifyHTMLSummary : json.formattedResults.ruleResults.MinifyHTML.urlBlocks[0].header.format,
               MinifyJavaScriptName : json.formattedResults.ruleResults.MinifyJavaScript.localizedRuleName,
               MinifyJavaScriptImpact : json.formattedResults.ruleResults.MinifyJavaScript.ruleImpact.toFixed(2),
               MinifyJavaScriptSummary : json.formattedResults.ruleResults.MinifyJavaScript.urlBlocks[0].header.format,
               MinimizeRenderBlockingName : json.formattedResults.ruleResults.MinimizeRenderBlockingResources.localizedRuleName,
               MinimizeRenderBlockingImpact : json.formattedResults.ruleResults.MinimizeRenderBlockingResources.ruleImpact.toFixed(2),
               MinimizeRenderBlockingSummary : json.formattedResults.ruleResults.MinimizeRenderBlockingResources.urlBlocks[0].header.format,
               OptimizeImagesName : json.formattedResults.ruleResults.OptimizeImages.localizedRuleName,
               OptimizeImagesImpact : json.formattedResults.ruleResults.OptimizeImages.ruleImpact.toFixed(2),
               OptimizeImagesSummary : json.formattedResults.ruleResults.OptimizeImages.urlBlocks[0].header.format,
               PrioritizeVisibleContentName : json.formattedResults.ruleResults.PrioritizeVisibleContent.localizedRuleName,
               PrioritizeVisibleContentImpact : json.formattedResults.ruleResults.PrioritizeVisibleContent.ruleImpact.toFixed(2),
               PrioritizeVisibleContentSummary : json.formattedResults.ruleResults.PrioritizeVisibleContent.urlBlocks[0].header.format,
              // screenshotData : newScreenshot,
               screenshotPath : imgSrc,
              //  screenshotType : 'image/png',
              //  screenshotwidth : json.screenshot.width,
              //  screenshotHeight : json.screenshot.height

             };

      testResult.desktop = desktop1 ;

    //  console.log('desktop',testResult);

      getMobileResult()

  });
}).on('error', function(e) {
console.error(e);
res.send(e);
});
}


function getMobileResult(){
  https.get({
  host: 'www.googleapis.com',
  path: '/pagespeedonline/v2/runPagespeed?url=' + encodeURIComponent(url) +
  '&key='+key+'&strategy='+mobileStrategy+'&screenshot='+screenshot
  }, function(resUsability) {
  var json1 = "";
  resUsability.on('data', function(d) {
  json1 += d;
  });
  resUsability.on('end', function(){
  json1 = JSON.parse(json1);

      var id = Math.floor(Math.random() * 200000000);
      const imgPath = __dirname + '/public/images/'+'screenshot'+id+'.jpeg';

      var newMobileScreenshot = json1.screenshot.data.replace(/_/g,'/').replace(/-/g,'+');

     fs.writeFile (imgPath, newMobileScreenshot,'base64', function(err){
       console.log(err);
     });
      var mobileImgSrc = 'screenshot'+id+'.jpeg' ;

           var Mobile1 = {
               SpeedScore : json1.ruleGroups.SPEED.score ,
               UsabilityScore : json1.ruleGroups.USABILITY.score,
               AvoidPluginsName : json1.formattedResults.ruleResults.AvoidPlugins.localizedRuleName,
               AvoidPluginsImpact : json1.formattedResults.ruleResults.AvoidPlugins.ruleImpact.toFixed(2),
               AvoidPluginsSummary :json1.formattedResults.ruleResults.AvoidPlugins.summary.format,
               ConfigureViewportName : json1.formattedResults.ruleResults.ConfigureViewport.localizedRuleName,
               ConfigureViewportImpact : json1.formattedResults.ruleResults.ConfigureViewport.ruleImpact.toFixed(2),
               ConfigureViewportSummary : json1.formattedResults.ruleResults.ConfigureViewport.summary.format,
               SizeContentToViewportName : json1.formattedResults.ruleResults.SizeContentToViewport.localizedRuleName,
               SizeContentToViewportImpact : json1.formattedResults.ruleResults.SizeContentToViewport.ruleImpact.toFixed(2),
               SizeContentToViewportSummary : json1.formattedResults.ruleResults.SizeContentToViewport.summary.format,
               SizeTapTargetsAppropriatelyName : json1.formattedResults.ruleResults.SizeTapTargetsAppropriately.localizedRuleName,
               SizeTapTargetsAppropriatelyImpact : json1.formattedResults.ruleResults.SizeTapTargetsAppropriately.ruleImpact.toFixed(2),
               SizeTapTargetsAppropriatelySummary : json1.formattedResults.ruleResults.SizeTapTargetsAppropriately.summary.format,
               UseLegibleFontSizesName : json1.formattedResults.ruleResults.UseLegibleFontSizes.localizedRuleName,
               UseLegibleFontSizesImpact : json1.formattedResults.ruleResults.UseLegibleFontSizes.ruleImpact.toFixed(2),
               UseLegibleFontSizesSummary : json1.formattedResults.ruleResults.UseLegibleFontSizes.summary.format,
               MobilescreenshotPath : mobileImgSrc
         };
      testResult.mobile= Mobile1;
      saveDBandSendResult();
     // console.log('finall data',testResult);
  });

 }).on('error', function(e) {
 console.error(e);
 res.send(e);
 });
}


function saveDBandSendResult (){
  //  Save to database
      Tests.create(testResult, function(err){
         if(err){
       console.log(err);
       }
         });

         console.log(testResult);
      res.json(testResult);
}

});

// Requesting All tests
app.get('/allTest/:skip',function(req,res){
  var skips = Number(req.params.skip);

console.log(skips);
Tests.find().skip(skips).limit(4).exec(function (err, tests) {
    if(err){
      console.log('getting previous results failed')
    }
    res.json(tests)
  });
});



//Test Detail Request

app.get('/resultDetailsPage/:_id',function(req,res){

    var id = req.params._id;
    console.log('test detail id',id);
    Tests.findById(id,function(err, testDetails){
    if(err){
      console.log('getting test details failed')
    }
    console.log('test detail result',testDetails);
    res.json(testDetails);
  });
});

//Passmarked method
app.get('/passmarked/',function(req,res){
  var targeturl = req.query.url;

  passmarked.create({
  url:    targeturl,
  token:   'PM_72dc0050757a11e7bfd8797c6d1b46895961501455443157'
}).on('done', function(result) {
  // or use:
  // var result = this.getResult();
  console.log('done with a score of', result.getScore())
  console.dir(result.toJSON())
  res.json(result);
}).on('update', function(result) {
  // or use:
  // var result = this.getResult()
  console.log(result.countPendingTests() + '/' + result.countTests())
}).start(function(err) {
  if (err) {
    console.log('Something went wrong starting the report')
    console.error(err)
  } else {
    console.log('Report started')
  }
})
});

app.listen(3001, function(err){
 if(err){
 return console.log(err);
 }
 console.log('API Sever is listening on http://localhost:3001');
});
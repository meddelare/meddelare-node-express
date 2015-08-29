# [Meddelare](https://meddelare.com/) Social Buttons Node.js Express Middleware [meddelare-node-express](https://github.com/meddelare/meddelare-node-express)


Install **custom social share counters** on your website with your **own hosted solution**, which only makes **a single API request** and loads **minimal or zero assets** to display the counters.

[![A screenshot of the button example](https://cloud.githubusercontent.com/assets/1398544/8511166/5c92d0b2-230b-11e5-895a-d3b67da749b5.png)](https://meddelare.com/)

Check out [meddelare.com](https://meddelare.com/) and view examples on [meddelare.com/meddelare-examples](https://meddelare.com/meddelare-examples).



---



## Node.js Express middleware

Node.js Express web server middleware for in-app, self-hosted Meddelare within your current server.

- If you want a ready-made standalone Meddelare server, check out [meddelare-node-server](https://github.com/meddelare/meddelare-node-server).
- If you want to use Meddelare from another server/service, check out [meddelare-node-counters](https://github.com/meddelare/meddelare-node-counters).



## Features

- **Completely customizable** user interface design -- use layout, logotypes, animations of your own choice.
- **A single API call** to get counts from multiple social networks, delivered as JSON or JSONP.
- **Calls social networks in parallel** from the server, making it (approximately) as fast to get the count from one as several at once.
- **No third party resources required** – you can host both the social buttons server and any resources yourself.
- **Blocks social networks' user tracking** by proxying calls until the user decides to click a share button.
- **Super-fast in-memory cache** keeps the most recent results per network and url.
- **Easy to deploy** and prepared for [content delivery network](https://en.wikipedia.org/wiki/Content_delivery_network) (CDN) proxies.



## Getting started

**Install package in your Express app folder**

```bash
npm install --save meddelare-express
```

**Add the MeddelareExpress to your Express app**

```javascript
var express = require("express"),
    app = express(),
    PORT = process.env.PORT || 5000;

var MeddelareExpress = require("meddelare-express"),
    meddelareExpress = new MeddelareExpress();

// Choose your own directory path for the middleware.
app.use("/meddelare/", meddelareExpress.getRouter());

app.listen(PORT, function() {
    console.log("Listening on " + PORT);
});
```

- Test by accessing your local server on [http://localhost:5000/meddelare/?networks=facebook,twitter,googleplus&url=https://meddelare.com](http://localhost:5000/meddelare/?networks=facebook,twitter,googleplus&url=https://meddelare.com) (depending on your configuration).



## Response

See this [example API call](https://meddelare-node-express.herokuapp.com/?networks=facebook,twitter,googleplus&url=https://meddelare.com). The response is delivered as JSON, or JSONP if you specify a callback.

```json
{
  "facebook": 5281,
  "googleplus": 42,
  "twitter": 8719
}
```



## HTML Widgets

View examples on [meddelare.com/meddelare-examples](https://meddelare.com/meddelare-examples).

**We would love to feature your widget design!**  
Please submit your design in a pull request to [meddelare-examples](https://github.com/meddelare/meddelare-examples) and we will add it to our list.

You can do anything you want to display your share counts when using the API. Below is a very simple example showing the count per network -- see this [example API call with text](https://meddelare.com/meddelare-examples/examples/text/). Note that we are using a CloudFront distribution domain in the examples.

```html
<!DOCTYPE html>
<html>
  <body>
    <h3>Twitter</h3>
    <span id="twitter"></span>
    <h3>Facebook</h3>
    <span id="facebook"></span>
    <h3>Google Plus</h3>
    <span id="googleplus"></span>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
    <script>
      $.ajax("https://d12cncu17l9pr5.cloudfront.net/?networks=facebook,twitter,googleplus&url=https://meddelare.com", {
        success: function (res, err) {
          $.each(res, function (network, value) {
            $("#" + network).text(value);
          });
        }
      });
    </script>
  </body>
</html>
```



## Options

Options are passed using query parameters in the url.


**Networks**  
Currently Twitter, Facebook and Google Plus are supported.

Use the `networks` query parameter to specify which ones you want to use as a comma-separated list (no spaces), for example `networks=facebook,twitter,googleplus` or `networks=facebook`.


**Url (optional)**  
Use the `url` parameter to specify the address which you want to retrieve the number of shares for, for example `url=https://meddelare.com`.

If you don't specify a `url` then the server will try to get the referring url's (HTTP `Referer` header) share count. This makes it easy to dynamically get the counts for the page currently open in the browser.


**Callback (optional)**  
Specify the `callback` parameter to have the results delivered as JSONP instead of plain JSON.



## Configuration

Configure the middleware instance at creation time.

**HTTP cache time**  
TODO `httpCacheTime: 4 * 60`


**Router options**  
TODO (hidden feature)
```javascript
routerOptions: {
    caseSensitive: true,
    strict: true,
},
```

**Social button counts**  
TODO `meddelareCounters: {}`

**Logger**  
TODO `logger: {}`



## Content delivery networks

If you want to reduce your server load it would be wise to throw up a cache, such as CloudFront, in front.

In CloudFront, just make sure you to inherit cache control directives from the server, enable query string forwarding and whitelist `Origin` HTTP headers. Either use your CloudFront distribution domain to access the API server or `CNAME` it with a custom domain of your choice.



## Thanks

Many thanks goes out to [Taskforce](https://taskforce.is/) for their [social-buttons-server](https://github.com/tfrce/social-buttons-server) (released into the [Public Domain](https://github.com/tfrce/social-buttons-server/tree/faf1a41e5d2d44b7e6de460b9369f11437095af1)) -- especially the creator [@thomasdavis](https://github.com/thomasdavis) and contributor [@beaugunderson](https://github.com/beaugunderson). This software, [meddelare-node-express](https://github.com/meddelare/meddelare-node-express), is based on their work.



---

Copyright (c) 2015 Team Meddelare <https://meddelare.com/> All rights reserved.

When using [meddelare-node-express](https://github.com/meddelare/meddelare-node-express), comply to the [MIT license](http://opensource.org/licenses/MIT).

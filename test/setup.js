var jsdom = require('jsdom');
const { JSDOM } = jsdom;
// Define global.window and global.document.
const { document } = (new JSDOM(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0">
    <title>Webpack App</title>
  </head>
  <body class="body">

    <header class="header">
      <h1>Cookie Clicker</h1>
      <p id="version"></p>
      <p id="auto-save"></p>
      <p>icons: <a href="http://www.flaticon.com">flaticon.com</a></p>
    </header>
    </header>
    <main>
      <div class="container">
        
        <div class="row">
          <div class="cookie">
            
            <button id="cookie" class="cookie__button"><img src="images/cookie.svg"></button>
            <div class="cookie__stats stats">
              <strong id="cookies-quantity" class="stats__cookies">-</strong>
            </div>
          </div>

          <div class="upgrades">
              <ul id="upgrades-list" class="upgrades__list">
              </ul>
            
          </div>
        </div>
        
      </div>
    </main>
    
    <footer class="footer">
      
    </footer>
    
    
    
    
  </body>
</html>`)).window;

global.document = document;
global.window = document;
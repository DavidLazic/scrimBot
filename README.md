## scrimBot

### Description
Image scraper bot.

![scrimBot](/screenshots/img.png?raw=true "scrimBot")

### Local setup

#### Install NodeJS
Download specific OS installation from [http://nodejs.org/download/](http://nodejs.org/download/).

#### Install project dependencies

````shell
$npm install -g grunt-cli
$npm install -g bower
````

#### Install application dependencies
Go to the project's root folder and run:
````shell
$npm install && bower install
````

### Running the application in development mode
````shell
$grunt serve
````

Access the application on  [http://localhost:5000/](http://localhost:5000/)

### Production build
````shell
$grunt build
````
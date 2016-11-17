var utils = require('utils');
var casper = require('casper').create({
  waitTimeout: 10000,
  stepTimeout: 10000,
  verbose: true,
  pageSettings: {
      webSecurityEnabled: false,
      loadImages: false, // The WebPage instance used by Casper will
      loadPlugins: false // use these settings
  },
  onWaitTimeout: function() {
      this.echo('** Wait-TimeOut **');
  },
  onStepTimeout: function() {
      this.echo('** Step-TimeOut **');
  },
  clientScripts:  [
      'vendor/jquery.js',      // These two scripts will be injected in remote
      'vendor/underscore.js'   // DOM on every request
  ],
  logLevel: "debug"
});

var user = casper.cli.get(0) || 'REPLACE THIS EMAIL';
var password = casper.cli.get(1) || 'REPLACE THIS PASSWORD';
casper.echo('user: ' + user + ' password: ' + password);

var urlSet = ['https://cas.xjtu.edu.cn/login?service=http://jiaoda.zhushou.la/login.asp',
              'http://jiaoda.zhushou.la/List.asp', 'http://jiaoda.zhushou.la/vote.asp'];


casper.start(urlSet[0]);

casper.waitForUrl(/login/, function() {
  this.echo('Title: ' + this.getTitle());
  this.echo('URL: ' + this.getCurrentUrl());
  this.evaluate(login, {a:user, b:password});
});

casper.waitForUrl(/List/, function() {
  this.echo('Title: ' + this.getTitle());
  this.echo('URL: ' + this.getCurrentUrl());
  this.echo('Name: ' + this.evaluate(vote));
});

casper.waitForUrl(/vote/, function() {
  this.echo('Title: ' + this.getTitle());
  this.echo('URL: ' + this.getCurrentUrl());
  //this.captureSelector('check.png', '#chk');
   if (this.exists('#Submitok2')) {
       this.echo('found #Submitok2', 'INFO');
       this.evaluate(check);
   } else {
       this.echo('#Submitok2 not found', 'ERROR');
   }
});

casper.waitForUrl(/logout/, function() {
  this.echo('Title: ' + this.getTitle());
  this.echo('URL: ' + this.getCurrentUrl());
});

casper.waitForUrl(/Vote_do/, function() {
  this.echo('EndTitle: ' + this.getTitle());
  this.echo('URL: ' + this.getCurrentUrl());
  if (this.exists('.title')) {
        this.echo('found .title', 'INFO');
  } else {
        this.echo('.title not found', 'ERROR');
  }
});

casper.run(function() {
  this.echo('Done.').exit();
});

function login(user, password) {
    $('#username').val(user);
    $('#password').val(password);
    $('.btn-submit')[0].click();
}

function logout() {
    $('#loginout')[0].click();
}

function vote() {
    $(".vote_btn").unbind("click").bind("click", function () {
        post('vote.asp', "148", 1);
    });
    $('.vote_btn')[0].click();
    return $('.loginstaus').text();
}

function check() {
    if ($('.loginstaus li').text().length > 2) {
      $('#loginout')[0].click();
    } else {
      $("#ValidCode").val('ok');
      $('#Submitok2')[0].click();
    }
}

function submit(captcha) {
    $("#ValidCode").val(captcha);
    $('#Submitok2')[0].click();
}

function feed() {
    return $(".title").text();
}



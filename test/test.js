import Database from '../src/js/database';

import View from '../src/js/view';

import Game from  '../src/js/game';

import { expect } from 'chai';

import producers from '../src/js/producers';

const jsdom = require('jsdom');

const { JSDOM } = jsdom;

let game;


beforeEach((done) => {
  JSDOM.fromFile( __dirname + '/../src/index.html')
  .then(dom => {
  
    global.document = dom.window.document;
    global.window = dom.window;
    const view = new View();
    const db = new Database();
    game = new Game(db, view);
    done();
  })
  .catch(error =>{
    console.error(error);
    done();
  });
});


describe('Cookies tests', () => {
  it('Initial cookies quantity should be 0',  () => {
    expect(game.cookies).equal(0);
  });

  it('Should add one cookie',  () => {
    expect(game.cookies).equal(0);
    game.addCookie();
    expect(game.cookies).equal(1);  
    
  });

  it('Should spend cookies',  () => {
    game.cookies = 200;
    expect(game.cookies).equal(200);  
    game.spendCookies(100);
    expect(game.cookies).equal(100);
  });

  it('Should not spend cookies',  () => {
    game.cookies = 50;
    game.spendCookies(100);
   
    expect(game.cookies).equal(50);
  });

  it('Should render producers',  () => {
    game.view.renderProducers(producers);
    let producerLength = producers.length;
    let renderedLength = document.getElementById('upgrades-list').childNodes.length;
   
    expect(renderedLength).equal(producerLength);
    
  });

   it('Should not upgrade producer if not enaugh cookies',  () => {
    game.upgradeProducer(0);
    const upgradedProducer =game.producers.find((producer)=>{
      return producer.id == 0;
    })
    expect(upgradedProducer.level).equal(0);
  
  });

  it('Should upgrade producer and spend cookies ', ()=>{
    const producer = producers[0];
    game.cookies = 1000;
    game.upgradeProducer(producer.id);

    const upgradedProducer =game.producers.find((_producer)=>{
      return producer.id == _producer.id;
    })
    expect(upgradedProducer.level).equal(1);
    expect(game.cookies).equal(1000 - producer.price);
  })
});
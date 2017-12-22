
import Database from './database';

import producers from './producers';

import View from './view.js';

import { FPS, SAVE_INTERVAL } from '../config/config';

export default class Game {

  constructor(db, view) {

    this.db = db;
    this.view = view;
    this.cookies = 0;
    this.producers = producers;

    this.loadData().then(() => {
      this.init();
    }).catch(() => {
      this.init()
    });
  }

  init() {
    
    this.setCookiesPerSecond();
    this.view.renderCookiesQuantity(this.cookies, this.cookiesPerSecond);
    this.view.bindUpgradeProducer(this.upgradeProducer.bind(this));
    this.view.bindAddCookie(this.addCookie.bind(this));
    this.view.renderProducers(this.producers);
    this.loop();
  }

  loadData() {
    return new Promise((resolve, reject) => {
      this.db.getAll('producers').then((cachedProducers) => {
        this.producers.forEach((producer) => {
          const cachedProducer = cachedProducers.find((cachedProducer) => {
            return cachedProducer.id === producer.id
          })

          if (typeof cachedProducer !== "undefined") {
              Object.assign(producer, cachedProducer);
          } 
        })
        return this.db.getOneByKey('cookies', 'stats')
      }).then(cachedCookies => {
        if (cachedCookies) {
          this.cookies = cachedCookies.quantity;
        }
        resolve();
      }).catch(()=>{
        reject();
      });
    })

  }

  upgradeProducer(id) {
    let producer = this.producers.find(_producer => {
      return id == _producer.id;
    });

    if (typeof producer.level === "undefined") {
      producer.level = 0;
    }

    const upgradePrice = this.checkUpgradePrice(producer)

    if (upgradePrice > this.cookies) {
      return;
    }

    producer.level += 1;

    this.spendCookies(upgradePrice);
    this.setCookiesPerSecond();

    this.db.put('producers', { id: producer.id, level: producer.level });
    this.db.put('stats', { id: 'cookies', quantity: this.cookies });
    this.view.renderProducers(this.producers);


  }

  setCookiesPerSecond() {
    let cps = 0;
    this.producers.forEach(({ cookiesPerSecond, level }) => {
      if (level > 0) {
        cps += cookiesPerSecond * level;
      }
    });
    this.cookiesPerSecond = cps;
  }

  addCookie() {
    this.cookies += 1;
    this.view.renderCookiesQuantity(this.cookies, this.cookiesPerSecond);
  }


  checkUpgradePrice(producer) {
    const { id, level, price, priceIncrease } = producer;
    if (level == 0) {
      return price;
    }

    return Math.ceil(price * Math.pow(priceIncrease, level))
  }

  spendCookies(amount) {
    if (this.cookies < amount) {
      return;
    }

    this.cookies -= amount;
  }

  availabilityChanged(producers) {
    let changed = false;
    producers.forEach(producer => {
      const upgradePrice = this.checkUpgradePrice(producer);

      if (this.cookies >= upgradePrice) {
        if (!producer.upgradeAvailable) {
          producer.upgradeAvailable = true;
          changed = true;
        }

      } else {
        if (producer.upgradeAvailable) {
          producer.upgradeAvailable = false;
          changed = true;
        }

      }
    });

    return changed;
  }

  loadProducers() {
    return new Promise((resolve, reject) => {
      this.db.getAll('producers').then(cachedProducers => {
        resolve(cachedProducers)
      });
    })
  }

  loop() {
    const saveInterval = SAVE_INTERVAL * FPS;
    let counter = 0;
    setInterval(() => {
      this.cookies += (this.cookiesPerSecond / FPS);

      this.view.renderCookiesQuantity(this.cookies, this.cookiesPerSecond);

      if (this.availabilityChanged(this.producers)) {
        this.view.renderProducers(this.producers);
      }
      counter++;
      if (counter == saveInterval) {
        this.db.put('stats', { id: 'cookies', quantity: this.cookies });
        counter = 0;
      }

    }, 1000/FPS)
  }

}
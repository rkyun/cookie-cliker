import {APP_VERSION, SAVE_INTERVAL} from '../config/config';

export default class View {

  constructor() {
    this.cookieButton = document.getElementById('cookie');
    this.upgradesList = document.getElementById('upgrades-list');
    this.cookiesQuantity = document.getElementById('cookies-quantity')

    document.getElementById('version').innerText = `version: ${APP_VERSION}`;
    document.getElementById('auto-save').innerText = `auto save: ${SAVE_INTERVAL} sec`;

  }

  renderProducers(producers, cookies = null) {
    let html = ''
    producers.forEach(({ id, imgUrl, name, price, priceIncrease, level, upgradeAvailable, cookiesPerSecond }) => {

      const buyCost = Math.ceil(price * Math.pow(priceIncrease, level));
      const currentCPS = Math.round(level * cookiesPerSecond * 100) / 100;

      html += `<li class="upgrades__item item ${!upgradeAvailable && 'item--disabled'}"> 
                <button class="item__button upgrade-button" data-producer-id="${id}"><img src="${imgUrl}"><p>${name}</p><div class="item__price"> 
                <img src="images/cookie.svg"><span>${buyCost}</span></div><span class="">${currentCPS} cps (+${cookiesPerSecond})</span></button>
                <span class="item__level">${level}</span>
              </li>`;
    });

    this.upgradesList.innerHTML = html;

  }

  renderCookiesQuantity(quantity, cookiesPerSecond) {
    quantity = Math.floor(quantity);
    cookiesPerSecond = Math.round(cookiesPerSecond * 100) / 100;

    this.cookiesQuantity.innerText = `${quantity} (+ ${cookiesPerSecond} cps)`;
    document.title = `${quantity} cookies`;
  }

  bindUpgradeProducer(handler) {
    this.upgradesList.addEventListener('click', event => {
      if (event.target && event.target.classList.contains('upgrade-button')) {
        const id = event.target.dataset.producerId;
        handler(id);
      }
    });
  }

  bindAddCookie(handler) {
    let rotate = 0;
    this.cookieButton.addEventListener('click', event => {
      rotate += 12;
      event.target.style.transform = `rotate(${rotate}deg)`;
      handler();
    });
  }

}
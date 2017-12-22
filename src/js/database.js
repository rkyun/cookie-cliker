import { DATABASE_NAME, DATABASE_VERSION } from '../config/config';

export default class Database {

  open() {

    return new Promise((resolve, reject) => {

      var request, db;

      if (!window.indexedDB) {
        return;
      }
      else {
        request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
        request.onerror = function (event) {
          reject(db);
        }
        request.onupgradeneeded = function (event) {
          db = event.target.result;

          const producersStore = db.createObjectStore("producers", { keyPath: "id" });
          const statsStore = db.createObjectStore("stats", { keyPath: "id" });
        };
        request.onsuccess = (event) => {
          db = event.target.result;
          resolve(db);
        }

      }

    });
  }

  put(store, data) {
    return new Promise((resolve, reject) => {
      this.open().then(db => {
        const transaction = db.transaction([store], "readwrite");
        transaction.oncomplete = function (event) {
          resolve();
        };

        transaction.onerror = function (event) {
          reject();
        };

        const objectStore = transaction.objectStore(store);
        objectStore.put(data);
      });
    });
  }


  getAll(store) {
    return new Promise((resolve, reject) => {

      this.open().then(db => {

        const transaction = db.transaction([store], "readwrite");
        const objectStore = transaction.objectStore(store);

        const request = objectStore.getAll();

        transaction.oncomplete = function (event) {
          resolve(request.result);
        };

        transaction.onerror = function (event) {
          resolve()
        };

      });


    })

  }

  getOneByKey(key, store) {
    return new Promise((resolve, reject) => {

      this.open().then(db => {

        const transaction = db.transaction([store], "readonly");
        const objectStore = transaction.objectStore(store);

        const request = objectStore.get(key);

        transaction.oncomplete = function (event) {
          resolve(request.result);
        };

        transaction.onerror = function (event) {
          resolve()
        };

      });


    })

  }
}
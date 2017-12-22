import Database from './database';

import View from './view';

import Game from  './game';

const db = new Database();
const view = new View();

export default new Game(db, view)






  

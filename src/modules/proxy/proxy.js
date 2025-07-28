let instance = null;

export class Proxy { //для даних

    constructor() {

    }

    static getInstance() {
        if (instance == null) {
            instance = new Proxy();
        }

        return instance;
    }

}


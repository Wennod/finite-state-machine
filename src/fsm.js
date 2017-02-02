class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error('config is\'not passed');
        }
        this.initialState = config.initial;
        this.state = config.initial;
        this.history = [config.initial];
        this.triggerDisabler = false;
        this.undoHistory = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        switch(state) {
            case 'hungry':
                this.state = state;
                this.history.push(this.state);
                this.triggerDisabler = true;
            break;
            case 'busy':
                this.state = state;
                this.history.push(this.state);
                this.triggerDisabler = true;
            break;
            case 'sleeping':
                this.state = state;
                this.history.push(this.state);
                this.triggerDisabler = true;
            break;
            case 'normal':
                this.state = state;
                this.history.push(this.state);
                this.triggerDisabler = true;
            break;
            default: 
            throw new Error('There is no such state!');
            break;
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        switch(this.state)
        {
            case 'hungry':
                if (event == 'eat') {
                    this.state = 'normal';
                    this.history.push(this.state);
                    if (this.triggerDisabler == false) {
                        this.triggerDisabler = true;
                    }
                } else {
                    throw new Error('No such event in this state');
                }
            break;
            case 'busy':
                if (event == 'get_tired') {
                    this.state = 'sleeping';
                    this.history.push(this.state);
                    if (this.triggerDisabler == false) {
                        this.triggerDisabler = true;
                    }
                }else if (event == 'get_hungry') {
                    this.state = 'hungry';
                    this.history.push(this.state);
                    if (this.triggerDisabler == false) {
                        this.triggerDisabler = true;
                    }
                }else {
                    throw new Error('No such event in this state');
                }
                
            break;
            case 'sleeping':
                if (event == 'get_hungry') {
                    this.state = 'hungry';
                    this.history.push(this.state);
                    if (this.triggerDisabler == false) {
                        this.triggerDisabler = true;
                    }
                }else if (event == 'get_up') {
                    this.state = 'normal';
                    this.history.push(this.state);
                    if (this.triggerDisabler == false) {
                        this.triggerDisabler = true;
                    }
                }else {
                    throw new Error('No such event in this state');
                }
                
            break;
            case 'normal':
                if (event == 'study') {
                    this.state = 'busy';
                    this.history.push(this.state);
                    if (this.triggerDisabler == false) {
                        this.triggerDisabler = true;
                    }
                }else {
                    throw new Error('No such event in this state');
                }
                
            break;
            default: 
            throw new Error('There is no such state!');
            break;           
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = 'normal';
        this.history.push(this.state);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
            switch(event) {
            case 'study':
                return ['normal'];               
                break;
            case 'get_tired':
                return ['busy'];                
                break;
            case 'get_hungry':
                return ['busy','sleeping'];
                break;
            case 'eat':
                return ['hungry'];
            break;
            case 'get_up':
                return ['sleeping'];
            default: 
                if (!event) {
                   return ['normal', 'busy', 'hungry', 'sleeping'];
                }else {
                       return [];
                      }
            break;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.length == 1) {
            return false;
        }
        else{
            this.undoHistory.push(this.history.pop());
            //this.changeState(this.history[this.history.length - 1]);
            this.state = this.history[this.history.length - 1];
            this.triggerDisabler = false;
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.undoHistory.length == 0) {
            return false;
        } else if (this.triggerDisabler == true){
            return false;
        }
        else{
            this.state = this.undoHistory[this.undoHistory.length - 1];
            this.history.push(this.undoHistory.pop());
            //this.state = this.history[this.history.length - 1];
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [this.initialState];
        this.undoHistory = [];

    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/

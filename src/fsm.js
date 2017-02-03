class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error('config is\'not passed');
        }
        this.config = config;
        this.initialState = config.initial;
        this.state = config.initial;
        this.history = [config.initial];
        this.undoHistory = [];
        this.triggerDisabler = false;
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
        if (!this.config.states.hasOwnProperty(state)) {
            throw new Error('There is no such state!');
        }

        for(var _state in this.config.states){
            if (_state == state) {
                this.state = state;
                this.history.push(this.state);
                this.triggerDisabler = true;
            }
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) { 
        for (var _stateCheck in this.config.states) {
            if (_stateCheck == this.state) {
                if (!this.config.states[_stateCheck].transitions.hasOwnProperty(event)) {
                    throw new Error('No such event in this state!');
                }
            }
        }
        for (var _state in this.config.states) {
            if(_state == this.state){
                for (var transition in this.config.states[_state].transitions) {
                    if(transition == event){
                        this.state = this.config.states[_state].transitions[transition];
                        this.history.push(this.state);
                        this.triggerDisabler = true;
                        return true;
                    }
                }
            }
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.initialState;
        this.history.push(this.state);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var inStates = []; 
        if (!event) {
            for (var _state in this.config.states) {
                inStates.push(_state);
            }
        }else {
            for (var _state in this.config.states) {
                if (this.config.states[_state].transitions.hasOwnProperty(event)) {
                    inStates.push(_state);
                }                    
            }
        }
        return inStates;
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

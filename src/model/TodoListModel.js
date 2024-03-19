import { EventEmitter } from "../EventEmitter.js";

export class TodoListModel extends EventEmitter {
    #items;
    constructor(items = []) {
        super();
        this.#items = items;
    }

    getTotalCount() {
        return this.#items.length;
    }

    getTodoItems() {
        return this.#items;
    }
    getCompletedCount() {
        return this.#items.filter(todo => todo.completed).length;
    }
    
    getIncompleteCount() {
        return this.#items.filter(todo => !todo.completed).length;
    }

    onChange(listener) {
        this.addEventListener("change", listener);
    }

    emitChange() {
        this.emit("change");
    }

    addTodo(todoItem) {
        this.#items.push(todoItem);
        this.emitChange();
    }

    updateTodo({ id, completed }) {
        const todoItem = this.#items.find(todo => todo.id === id);
        if (!todoItem) {
            return;
        }
        todoItem.completed = completed;
        this.emitChange();
    }

    deleteTodo({ id }) {
        this.#items = this.#items.filter(todo => {
            return todo.id !== id;
        });
        this.emitChange();
    }

    updateTodoTitle({ id, title }) {
        const todoItem = this.#items.find(todo => todo.id === id);
        if (!todoItem) {
            return;
        }
        todoItem.title = title;
        this.emitChange();
    }
}

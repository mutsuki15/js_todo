import { TodoListModel } from "./model/TodoListModel.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { element, render } from "./view/html-util.js";

export class App {
    #todoListModel = new TodoListModel();

    mount() {
        const formElement = document.querySelector("#js-form");
        const inputElement = document.querySelector("#js-form-input");
        const containerElement = document.querySelector("#js-todo-list");
        const todoItemCountElement = document.querySelector("#js-todo-count");
        
        this.#todoListModel.onChange(() => {
            const todoListElement = element`<ul></ul>`;
            const todoItems = this.#todoListModel.getTodoItems();
            todoItems.forEach(item => {
                const todoItemElement = item.completed
                    ? element`<li class="mt-2" style="list-style: none;" data-id="${item.id}"><input type="checkbox" class="checkbox" checked>
                        <s>${item.title}</s>
                        <button type="button" class="btn btn-success">編集</button>
                        <button type="button" class="delete btn btn-danger">削除</button>
                    </li>`
                    : element`<li class="mt-2" style="list-style: none;" data-id="${item.id}"><input type="checkbox" class="checkbox">
                        <span>${item.title}</span>
                        <button type="button" class="btn btn-success">編集</button>
                        <button type="button" class="delete btn btn-danger">削除</button>
                    </li>`;
                const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
                inputCheckboxElement.addEventListener("change", () => {
                    this.#todoListModel.updateTodo({
                        id: item.id,
                        completed: !item.completed
                    });
                });
                const deleteButtonElement = todoItemElement.querySelector(".delete");
                deleteButtonElement.addEventListener("click", () => {
                    if(!window.confirm("本当に消去してもよろしいですか")){return}
                    this.#todoListModel.deleteTodo({
                        id: item.id
                    });
                });
                todoListElement.appendChild(todoItemElement);
            });
            render(todoListElement, containerElement);
            todoItemCountElement.textContent = `全てのタスク：${this.#todoListModel.getTotalCount()} 完了済み：${this.#todoListModel.getCompletedCount()} 未完了：${this.#todoListModel.getIncompleteCount()}`;
        });

        formElement.addEventListener("submit", (event) => {
            event.preventDefault();
            const inputValue = inputElement.value;
            if (!inputValue) {
                alert("アイテムを入力してください");
                return;
            }
            this.#todoListModel.addTodo(new TodoItemModel({
                title: inputElement.value,
                completed: false
            }));
            inputElement.value = "";
        });

        const createButtonElement = document.querySelector("#js-create-button");
        createButtonElement.addEventListener("click", () => {
            const inputValue = inputElement.value;
            if (!inputValue) {
                alert("アイテムを入力してください");
                return;
            }
            this.#todoListModel.addTodo(new TodoItemModel({
                title: inputElement.value,
                completed: false
            }));
            inputElement.value = "";
        });

        // 編集ボタンがクリックされたときの処理を追加
        containerElement.addEventListener("click", (event) => {
            const target = event.target;

            // 編集ボタンがクリックされたかどうかをチェック
            if (target.classList.contains("btn-success") && target.textContent === "編集") {
                const listItem = target.parentElement;
                let todoTitle = listItem.querySelector("s");
                  if (!todoTitle) {
                    todoTitle = listItem.querySelector("span");
                  }
                const editInput = document.createElement("input");
                editInput.type = "text";
                editInput.classList.add("edit-input");
                editInput.value = todoTitle ? todoTitle.textContent : '';
                listItem.insertBefore(editInput, todoTitle);
                if (todoTitle && listItem.contains(todoTitle)) {
                    listItem.removeChild(todoTitle);
                }

                // 編集および削除のボタンを非表示にする
                const editButton = listItem.querySelector(".btn-success");
                const deleteButton = listItem.querySelector(".delete");
                editButton.style.display = "none";
                deleteButton.style.display = "none";

                // 保存ボタンを作成して表示させる
                const saveButton = document.createElement("button");
                saveButton.textContent = "保存";
                saveButton.classList.add("btn", "btn-primary", "save");
                listItem.appendChild(saveButton);

                // 保存ボタンがクリックされたときの処理を追加
                saveButton.addEventListener("click", () => {
                    const updatedTitle = editInput.value;
                    if (!updatedTitle) {
                        alert("アイテムを入力してください");
                        return;
                    }
                    // 更新されたタイトルをTodoListModelに反映
                    this.#todoListModel.updateTodoTitle({
                        id: parseInt(listItem.dataset.id),
                        title: updatedTitle
                    });
                });
            }
        });
    }
}

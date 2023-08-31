"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/** auto bind decorator */
const autobind = (_, _2, descriptor) => {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const bindFn = originalMethod.bind(this);
            return bindFn;
        }
    };
    return adjDescriptor;
};
/** Project Type */
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
/** Project */
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    addProject(title, description, numOfPeople) {
        const newProject = new Project(Math.random.toString(), title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
const validate = (valInput) => {
    let isValid = true;
    if (valInput.required) {
        isValid = isValid && valInput.value.toString().trim().length !== 0;
    }
    if (valInput.minLength != null && typeof valInput.value === 'string') {
        isValid = isValid && valInput.value.length >= valInput.minLength;
    }
    if (valInput.maxLength != null && typeof valInput.value === 'string') {
        isValid = isValid && valInput.value.length <= valInput.maxLength;
    }
    if (valInput.min != null && typeof valInput.value === 'number') {
        isValid = isValid && valInput.value >= valInput.min;
    }
    if (valInput.max != null && typeof valInput.value === 'number') {
        isValid = isValid && valInput.value <= valInput.max;
    }
    return isValid;
};
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('projectInput');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = 'user-input';
        this.titleInput = this.element.querySelector("#title");
        this.descriptionInput = this.element.querySelector("#description");
        this.peopleInput = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    getInputData() {
        const enteredTitle = this.titleInput.value;
        const enteredDescription = this.descriptionInput.value;
        const enteredPeople = this.peopleInput.value;
        if (validate({ value: enteredTitle, required: true, minLength: 5 }) &&
            validate({ value: enteredDescription, required: true, minLength: 5 }) &&
            validate({ value: +enteredPeople, min: 5 })) {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
        else {
            alert('Invalid data');
            return;
        }
    }
    clearInputs() {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.getInputData();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people);
            console.log(title, description, people);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
/** Project list */
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById('projectList');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        this.assignedProjects = [];
        /** add projectState  */
        projectState.addListener((projects) => {
            const releventProjects = projects.filter(prj => {
                if (this.type == 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = releventProjects;
            this.renderProjects();
        });
        this.attach();
        this.renderContent();
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-project-list`);
        listEl.innerHTML = '';
        for (const prjItem of this.assignedProjects) {
            const listItem = document.createElement('li');
            listItem.textContent = prjItem.title;
            listItem.classList.add('list-group-item');
            listItem.classList.add('m-2');
            listItem.classList.add('shadow-sm');
            listEl.appendChild(listItem);
        }
    }
    renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
/** component base class */
const prjListFinished = new ProjectList('finished');
const prjListActive = new ProjectList('active');
const prjInput = new ProjectInput();
//# sourceMappingURL=app.js.map
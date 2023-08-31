/** auto bind decorator */
const autobind = (_:any, _2: string|symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const bindFn = originalMethod.bind(this)
            return bindFn
        }
    }
    return adjDescriptor
}

/** Project Type */
enum ProjectStatus
{
    Active, Finished
}

/** Project */
class Project
{
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ){}
}

/** create project state */
type Listener =  (items: Project[]) => void;

class ProjectState
{
    private listeners: Listener[] = [];
    private projects: Project[] = [];

    private static instance: ProjectState;

    private constructor()
    {}

    static getInstance()
    {
        if(this.instance)
        {
            return this.instance
        }
        this.instance = new ProjectState()
        return this.instance
    }

    addListener(listenerFn: Listener)
    {
        this.listeners.push(listenerFn)
    }

    addProject (title: string, description: string, numOfPeople: number) 
    {
        const newProject = new Project(
            Math.random.toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        )
        this.projects.push(newProject)
        for(const listenerFn of this.listeners)
        {
            listenerFn(this.projects.slice())
        }
    }
}

const projectState = ProjectState.getInstance()


/** validation */
interface Validatable 
{
    value: string | number,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    min?: number,
    max?: number
}

const validate = ( valInput: Validatable ) => {
    let isValid = true

    if(valInput.required)
    {
        isValid = isValid && valInput.value.toString().trim().length !== 0;
    }

    if(valInput.minLength != null && typeof valInput.value === 'string')
    {
        isValid = isValid && valInput.value.length >= valInput.minLength
    }

    if(valInput.maxLength != null && typeof valInput.value === 'string')
    {
        isValid = isValid && valInput.value.length <= valInput.maxLength
    }

    if(valInput.min != null && typeof valInput.value === 'number')
    {
        isValid = isValid && valInput.value >= valInput.min
    }

    if(valInput.max != null && typeof valInput.value === 'number')
    {
        isValid = isValid && valInput.value <= valInput.max
    }
    return isValid;
}


class ProjectInput
{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;

    constructor()
    {
        this.templateElement = document.getElementById('projectInput')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInput = this.element.querySelector("#title")! as HTMLInputElement;
        this.descriptionInput = this.element.querySelector("#description")! as HTMLInputElement;
        this.peopleInput = this.element.querySelector("#people")! as HTMLInputElement;

        this.configure();
        this.attach();

    }

    private getInputData(): [string, string, number] | void
    {
        const enteredTitle = this.titleInput.value
        const enteredDescription = this.descriptionInput.value
        const enteredPeople = this.peopleInput.value
        
        if(
            validate({ value: enteredTitle, required: true, minLength: 5 }) &&
            validate({ value: enteredDescription, required: true, minLength: 5 }) &&
            validate({ value: +enteredPeople, min: 5 })
        )
        {
            return [ enteredTitle, enteredDescription, +enteredPeople ]
        }
        else
        {
            alert('Invalid data')
            return
        }
    }

    
    private clearInputs()
    {
        this.titleInput.value = ''
        this.descriptionInput.value = ''
        this.peopleInput.value = ''
    }

    @autobind
    private submitHandler(event: Event)
    {
        event.preventDefault();
        const userInput = this.getInputData();

        if(Array.isArray(userInput))
        {
            const [title, description, people] = userInput
            projectState.addProject(title, description, people)
            console.log(title, description, people)
            this.clearInputs()
        }
    }

    private configure()
    {
        this.element.addEventListener('submit', this.submitHandler)
    }


    private attach()
    {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
    
}

/** Project list */
class ProjectList
{

    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished')
    {
        this.templateElement = document.getElementById('projectList')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = `${this.type}-projects`;

        this.assignedProjects = [];

        /** add projectState  */
        projectState.addListener( (projects: Project[]) => {
            const releventProjects = projects.filter(prj => {
                if(this.type == 'active')
                {
                    return prj.status === ProjectStatus.Active
                }
                return prj.status === ProjectStatus.Finished
            })
            this.assignedProjects = releventProjects;
            this.renderProjects();
        });

        this.attach();
        this.renderContent();
    }

    private renderProjects()
    {
        const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for ( const prjItem of this.assignedProjects )
        {
            const listItem = document.createElement('li')
            listItem.textContent = prjItem.title;
            listItem.classList.add('list-group-item')
            listItem.classList.add('m-2')
            listItem.classList.add('shadow-sm')

            listEl.appendChild(listItem)
        }
    }

    private renderContent()
    {
        const listId = `${this.type}-project-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
    }

    private attach()
    {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
    
}


/** component base class */



const prjListFinished = new ProjectList('finished');
const prjListActive = new ProjectList('active');
const prjInput = new ProjectInput();


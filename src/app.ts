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


    private submitHandler(event: Event)
    {
        event.preventDefault();
        console.log(this.titleInput.value)
    }

    private configure()
    {
        this.element.addEventListener('submit', this.submitHandler.bind(this))
    }


    private attach()
    {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
    
}

const prjInput = new ProjectInput();
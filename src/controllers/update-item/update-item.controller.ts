
//pre-fill the fields
const onceInitDataUpdateCb = (e: any, travel: any) => {
    (document.getElementById('title') as HTMLInputElement).value = travel.title;
    (document.getElementById('destination') as HTMLInputElement).value = travel.destination;
    (document.getElementById('price') as HTMLInputElement).value = travel.price;
    (document.getElementById('image') as HTMLInputElement).value = travel.image;

    smallDescUpdate.value = travel.smallDesc;

    (document.getElementById('longDesc') as HTMLTextAreaElement).value = travel.longDesc;

    document.querySelector('button')!.remove()

    const button = document.createElement('button')
    button.type = 'submit'
    button.classList.add('btn', 'btn-warning', 'mt-4', 'ms-auto', 'd-block')
    button.textContent = 'Modifier l\'offre'

    const form = document.querySelector('form') as HTMLFormElement
    form.appendChild(button)

    //submit form event
    button.addEventListener('click', e => {
        e.preventDefault()

        button.disabled = true

        //item constructor
        const dataForm = new FormData(form)
        const price = parseFloat((dataForm.get('price') as string).replace(',', '.'))
        const newTravel = {
            id: travel.id,
            title: dataForm.get('title'),
            image: dataForm.get('image'),
            destination: dataForm.get('destination'),
            smallDesc: dataForm.get('smallDesc'),
            longDesc: dataForm.get('longDesc'),
            price: isNaN(price) ? 0 : price
        };

        //success or error response
        (window as any).ipcRendererCustom.invokeUpdateItem(newTravel, (res: any) => {
            button.disabled = false

            const divMessage = document.querySelector('#response-message')! as HTMLElement
            divMessage.textContent = res.msg
            divMessage.classList.remove('alert-success', 'alert-danger')
            divMessage.hidden = false

            res.success ? divMessage.classList.add('alert-success') : divMessage.classList.add(('alert-danger'))
        })
    })

    initCounter()
}

(window as any).ipcRendererCustom.onceInitData(onceInitDataUpdateCb);
(window as any).ipcRendererCustom.onInitNewData(onceInitDataUpdateCb);

const smallDescUpdate = document.getElementById('smallDesc') as HTMLTextAreaElement
smallDescUpdate.addEventListener('input', initCounter);

//character counter
function initCounter() {
    const leftCharLength = parseInt(smallDescUpdate.getAttribute('maxlength') as string)! - smallDescUpdate.value.length
    const counter = document.getElementById('counter')!
    counter.querySelector('span')!.textContent = `${leftCharLength}`

    leftCharLength === 0 ? counter.classList.add('text-danger') : counter.classList.remove('text-danger')
}
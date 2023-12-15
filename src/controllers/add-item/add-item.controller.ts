
//character counter
const smallDesc = document.getElementById('smallDesc') as HTMLTextAreaElement
smallDesc.addEventListener('input', e => {
    const leftCharLength = parseInt(smallDesc.getAttribute('maxlength') as string)! - smallDesc.value.length
    const counter = document.getElementById('counter')!
    counter.querySelector('span')!.textContent = `${leftCharLength}`

    leftCharLength === 0 ? counter.classList.add('text-danger') : counter.classList.remove('text-danger')
})

//submit form event
document.querySelector('form')!.addEventListener('submit', e => {
    e.preventDefault();

    const button = document.querySelector('button')!
    button.disabled = true

    //item constructor
    const dataForm = new FormData(e.target as HTMLFormElement)
    const price = parseFloat((dataForm.get('price') as string).replace(',', '.'))
    const newTravel = {
        title: dataForm.get('title'),
        image: dataForm.get('image'),
        destination: dataForm.get('destination'),
        smallDesc: dataForm.get('smallDesc'),
        longDesc: dataForm.get('longDesc'),
        price: isNaN(price) ? 0 : price
    };

    //success or error response
    (window as any).ipcRendererCustom.invokeAddNewItem(newTravel, (res: any) => {
        button.disabled = false

        const divMessage = document.querySelector('#response-message')! as HTMLElement
        divMessage.textContent = res.msg
        divMessage.classList.remove('alert-success', 'alert-danger')
        divMessage.hidden = false

        res.success ? divMessage.classList.add('alert-success') : divMessage.classList.add(('alert-danger'))
    })
})
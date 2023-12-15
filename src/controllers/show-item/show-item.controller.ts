
//displays data
function initData(travel: any) {
    document.title = travel.title
    document.getElementById('title')!.textContent = travel.title
    document.getElementById('destination')!.textContent = `Destination : ${travel.destination}`;

    const image = (document.getElementById('image') as HTMLImageElement)
    image.src = travel.image
    image.addEventListener("error", e => {
        image.src = 'https://theherotoys.com/wp-content/uploads/2020/11/no-image-available_1.png'
    })

    document.getElementById('smallDesc')!.textContent = travel.smallDesc
    document.getElementById('longDesc')!.textContent = travel.longDesc
    document.getElementById('price')!.textContent = `${travel.price.toFixed(2)} €`
    document.getElementById('updateButton')!.remove()
    document.getElementById('deleteButton')!.remove()

    const updateButton = document.createElement('button')!
    updateButton.classList.add('btn', 'btn-warning', 'mx-2')
    updateButton.id = 'updateButton'
    updateButton.textContent = 'Modifier l\'offre'
    updateButton.addEventListener('click', () => (window as any).ipcRendererCustom.sendAskUpdateItem(travel.id))

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('btn', 'btn-danger')
    deleteButton.id = 'deleteButton'
    deleteButton.textContent = 'Supprimer l\'offre'
    deleteButton.addEventListener('click', () => (window as any).ipcRendererCustom.sendAskDeleteItem(travel.id))

    document.getElementById('button')!.append(updateButton, deleteButton)
}

//generate data
const onceInitShowDataCb = (e: any, travel: any) => {
    initData(travel)
}

(window as any).ipcRendererCustom.onceInitData(onceInitShowDataCb)

//generate new data
const onInitShowNewData = (e: any, travel: any) => {
    initData(travel)
}

(window as any).ipcRendererCustom.onInitNewData(onInitShowNewData)
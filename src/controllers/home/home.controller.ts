
//generate data element
const generateCard = (travel: any) => {
    const card = document.createElement('div')
    card.classList.add('card', 'bg-whitSmoke', 'shadow', 'mb-4', 'w-100')
    card.dataset.id = travel.id
    card.addEventListener('click', ()  => {
        (window as any).ipcRendererCustom.sendAskShowItem(travel.id)
    })

    const rowCard = document.createElement('div')
    rowCard.classList.add('row', 'g-0')

    const colImage = document.createElement('div')
    colImage.classList.add('col-md-4')

    const img = document.createElement('img')
    img.classList.add('img-fluid', 'rounded-start', 'h-100')
    img.src = travel.image
    img.alt = 'Photo de la destination'
    img.addEventListener("error", e => {
        img.src = 'https://theherotoys.com/wp-content/uploads/2020/11/no-image-available_1.png'
    })

    colImage.appendChild(img)

    const cardBody = document.createElement('div')
    cardBody.classList.add('row', 'g-0', 'card-body', 'col-md-8')

    const colTitle = document.createElement('div')
    colTitle.classList.add('col-7')

    const title = document.createElement('h2')
    title.classList.add('card-title', 'fs-3', 'title')
    title.textContent = travel.title

    const destination = document.createElement('h3')
    destination.classList.add('card-subtitle', 'text-body-secondary', 'fs-5', 'mb-3', 'destination')
    destination.textContent = travel.destination

    colTitle.append(title, destination)

    const colPrice = document.createElement('div')
    colPrice.classList.add('col-5', 'fs-5', 'fw-bold')

    const price = document.createElement('p')
    price.classList.add('card-text', 'm-2','p-2', 'blue', 'rounded', 'text-center', 'ms-auto', 'price')
    price.textContent = `${travel.price.toFixed(2)} €`

    colPrice.appendChild(price)

    const smallDesc = document.createElement('p')
    smallDesc.classList.add('card-text', 'col-12', 'smallDesc')
    smallDesc.textContent = travel.smallDesc

    cardBody.append(colTitle, colPrice, smallDesc)

    rowCard.append(colImage, cardBody)

    card.appendChild(rowCard)

    document.getElementById('card-container')!.appendChild(card)
}

//generates data
const onceInitDataCb = (e: any, travels: any) => {
    travels.forEach((travel: any) => {
        generateCard(travel)
    })
}

(window as any).ipcRendererCustom.onceInitData(onceInitDataCb)

//button add item event
const button = document.querySelector('button')!
button.addEventListener('click', (e) => {
    (window as any).ipcRendererCustom.sendAskAddItem()
});

//generate new item
const onNewItemAdded = (e: any, travel: any) => {
    generateCard(travel)
}

(window as any).ipcRendererCustom.onNewItemAdded(onNewItemAdded);

//regenerates the updated object
const onItemEditedCb = (e: any, travel: any) => {
    const card = document.querySelector(`[data-id='${travel.id}']`)!
    console.log(travel.img)
    card.querySelector('img')!.src = travel.image

    card.querySelector('.title')!.textContent = travel.title
    card.querySelector('.destination')!.textContent = travel.destination
    card.querySelector('.smallDesc')!.textContent = travel.smallDesc
    card.querySelector('.price')!.textContent = `${travel.price.toFixed(2)} €`
}

(window as any).ipcRendererCustom.onItemUpdated(onItemEditedCb)

//dlete element
const onDeletedItemCb = (e: any, id: number) => {
    document.querySelector(`[data-id='${id}']`)!.remove()
}

(window as any).ipcRendererCustom.onDeletedItem(onDeletedItemCb)
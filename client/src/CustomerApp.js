import DropdownButton from 'react-bootstrap/DropdownButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'

import { useState, useEffect } from "react"

import InventoryService from "./Services/InventoryService.js"
import OrderService from './Services/OrderService.js'

import ViewCustOrders from './components/CustomerApp/ViewCustOrders .js'
import CreateOrder from "./components/CustomerApp/CreateOrder.js"

import "bootstrap-icons/font/bootstrap-icons.css"
import "./App.css"

const defaultCategory = "All"
const tabs = {
    viewProducts : 1,
    trackOrders : 2,
    shoppingCart : 3
}

function ItemsDisplay(props){
    const itemRenderData = props.itemData.filter((item) => {
        return (props.category == defaultCategory || props.category == item.Category) 
            && (!props.searchTerm || item.Name.toLowerCase().includes(props.searchTerm.toLowerCase()))
    })

    function AddButton(props){
        const [isActive, setActive] = useState(false)
        const [quantity, setQuantity] = useState(1)

        return(
            <div>
                {                    
                    !isActive &&
                        <Button 
                            variant='primary'
                            bsPrefix="rounded-pill btn btn-primary ps-4 pe-4"
                            onClick={() => {
                                setActive(true)
                            }}
                        >
                            Add
                        </Button>
                    ||
                        <div class="rounded-pill bg-primary">
                            {
                                !isActive && <>Add</>
                                || 
                                <>                        
                                    <InputGroup>
                                        <Button 
                                            bsPrefix="transparent ms-1"
                                            onClick={() => {
                                                setActive(false)
                                                setQuantity(1)
                                            }}                      
                                        >
                                            <i class="bi bi-x-lg text-light"/>
                                        </Button>

                                        <Form.Control
                                            type="number"
                                            min="1"
                                            max="100"
                                            id="q"
                                            placeholder="1"
                                            autoComplete="off"
                                            onChange={(e) => {
                                                setQuantity(parseInt(e.target.value))
                                            }}
                                            onKeyDown={(e) => {
                                                e.preventDefault()
                                            }}
                                        />  

                                        <Button 
                                            bsPrefix="transparent me-1"
                                            onClick={() => {
                                                setActive(false)
                                                props.onAdded(quantity)
                                                setQuantity(1)
                                            }}                      
                                        >
                                            <i class="bi bi-check-lg text-light"/>
                                        </Button>
                                    </InputGroup>                             
                                </>
                            }
                        </div>    
                }            
            </div>
        )
    }

    return (
        <>
            <div class="row w-100 justify-content-left mx-auto">
                {
                    itemRenderData.map(item => {
                        return (
                            <>
                                <div class="col-md-4 h-100">
                                    <div class="mb-2 fw-bolder">
                                        {item.Name}
                                    </div>

                                    {
                                      props.category == defaultCategory && 
                                      <div class="mb-2">
                                        <Badge bg="secondary">{item.Category}</Badge> 
                                      </div>
                                      
                                    }

                                    <div class="mb-2 fw-light">
                                        {item.Description}
                                    </div>

                                    <div class="mb-2">
                                        ${item.Price}
                                    </div>

                                    <AddButton
                                        onAdded={(quantity)=>{
                                            props.onItemAdded({
                                                Quantity : quantity,
                                                Name : item.Name,
                                                Price : parseInt(item.Price),
                                                ItemId : item.ItemId
                                            })
                                        }}
                                    />                                    
                                    <hr/>                                             
                                </div>                                        
                            </>
                        )
                    })
                }
            </div>
            
            {
               itemRenderData.length == 0 && props.searchTerm &&
                <>
                    <div class="fw-light">
                        <p>
                            Your search - <b>{props.searchTerm}</b> - did not match any of our products 
                            {
                                props.category != defaultCategory &&
                                <> in the <b>{props.category}</b> category</>
                            }.
                        </p>

                        <div class="mt-2">Suggestions:</div>

                        <div>1. Make sure that all words are spelled correctly.</div>
                        <div>2. Try different keywords.</div>
                    </div>
                </>
            }
        </>
    )
}

function CategoryDropdowns(props){
    let categoriesRenderData = []

    props.categoryList.forEach(category => {
        categoriesRenderData.push(
            <Dropdown.Item eventKey={category}>{category}</Dropdown.Item>
        )
    })

    return categoriesRenderData
}

function ViewProductsComponent(props){    
    const [category, setCategory] = useState(defaultCategory)
    const [categoryList, setCategoryList] = useState([])    
    const [searchTerm, setSearchTerm] = useState()
    const [itemData, setItemData] = useState([])

    function resetSearch(){
        setSearchTerm()
        document.getElementById("search-bar").value = ""
    }

    useEffect(() => {
        InventoryService.getItems().then((itemData) => {
            if (!itemData) return

            let tempCategoryList = []
            let prevCategory          
            
            itemData.forEach(item => {
                if (item.Category != prevCategory){
                    prevCategory = item.Category
                    tempCategoryList.push(prevCategory)
                }
            })

            itemData.sort(function(item1, item2){
                const name1 = item1.Name.toLowerCase()
                const name2 = item2.Name.toLowerCase()

                if (name1 < name2) return -1
                if (name1 > name2) return 1

                return 0
            })

            setCategoryList(tempCategoryList)
            setItemData(itemData)
        })
    }, [])

    return (
        <>
            <div class="mb-5 w-100">
                <InputGroup>
                    <DropdownButton 
                        as={ButtonGroup} 
                        title={category} 
                        id="bg-nested-dropdown" 
                        variant='outline-secondary'
                        onSelect={eventKey => {
                            setCategory(eventKey)
                            resetSearch()
                        }}
                    >
                        <Dropdown.Item eventKey={defaultCategory}>{defaultCategory}</Dropdown.Item>
                        <CategoryDropdowns categoryList={categoryList}/>                        
                    </DropdownButton>

                    {
                        searchTerm && 
                        <Button 
                            variant='outline-secondary'
                            onClick={() => {
                                resetSearch()
                            }}                       
                        >
                            <i class="bi bi-x-lg"/>
                        </Button>
                    }

                    <Form.Control
                        type="text"
                        aria-describedby="btnGroupAddon"
                        id="search-bar"
                        autoComplete="off"
                    />

                    <Button 
                        variant='primary'
                        onClick={() => {
                            setSearchTerm(document.getElementById("search-bar").value)
                        }}
                    >
                        <i class="bi bi-search"/>
                    </Button>
                </InputGroup>
            </div>

            <div>
                <ItemsDisplay 
                    category={category} 
                    itemData={itemData} 
                    searchTerm={searchTerm}
                    onItemAdded={props.onItemAdded}                
                />          
            </div>        
        </>
    )
}

function TabButton(props){
    return (
        <Button variant="light" onClick={props.clickListener}>
            <div class="text-start fs-6">
                {props.headingText}
            </div>
            
            <div class="text-start fw-bold fs-6">
                {props.bodyText}
            </div>
            
            {props.isActive && <div class="bg-primary div-line mt-2"/> || <div class="div-line mt-2"/>}            
        </Button>
    )
}

function CustomerApp(props){
    const [activeTab, setActiveTab] = useState(tabs.viewProducts)
    const [cartData, setCartData] = useState(JSON.parse(sessionStorage.getItem("cartData")) || [])

    const createTabButtonListener = (linkedTab) => {
        return () => {
            setActiveTab(linkedTab)
        }
    }

    const updateCartData = (newCartData) => {
        setCartData(newCartData)
        sessionStorage.setItem("cartData", JSON.stringify(newCartData))
    }

    return(
        <>           
            <div class="container dashboard-container ps-5 pe-5">
                <div class="row justify-content-between w-100 mx-auto mt-5">
                    <div class="col-8 fs-6">
                        <ButtonGroup>     
                            <TabButton
                                headingText="View"
                                bodyText="Products"
                                clickListener={createTabButtonListener(tabs.viewProducts)}
                                isActive={activeTab == tabs.viewProducts}
                            />
                            <TabButton
                                headingText="Track"
                                bodyText="My orders"
                                clickListener={createTabButtonListener(tabs.trackOrders)}
                                isActive={activeTab == tabs.trackOrders}
                            />
                        </ButtonGroup>
                    </div>
                    
                    <div class="col-4 d-flex justify-content-end">
                        <Button
                            variant="light ps-4"
                            onClick={createTabButtonListener(tabs.shoppingCart)}
                        >
                            <i
                                class={activeTab == tabs.shoppingCart && "bi bi-cart fs-3 text-primary" || "bi bi-cart fs-3"}
                            />

                            <span class="translate-middle badge rounded-pill bg-primary">
                                    {cartData.length}
                            </span>                           
                        </Button>
                    </div>
                </div> 

                <hr/>
                
                <div class="mt-5 mb-5">
                    {
                        activeTab == tabs.viewProducts && 
                            <>
                                <ViewProductsComponent
                                    onItemAdded={(addedItemData) => {
                                        let wasItemInCart = false
                                        const newCartData = cartData.map(item => {
                                            if (item.ItemId == addedItemData.ItemId){
                                                console.log(item)
                                                wasItemInCart = true
                                                return {...item, Quantity : item.Quantity + addedItemData.Quantity}
                                            }

                                            return item
                                        })

                                        if (!wasItemInCart)
                                            newCartData.push(addedItemData)                     

                                        updateCartData(newCartData)
                                    }}                                
                                />
                            </>
                        || activeTab == tabs.trackOrders && <ViewCustOrders userId={props.userId}/>
                        || <CreateOrder 
                                cartData={cartData}
                                onItemRemoved={(removeIndex)=>{
                                    const newCartData = cartData.filter((_, index) => {
                                        return index != removeIndex
                                    })

                                    updateCartData(newCartData)
                                }}
                                onOrderPlaced={
                                    ()=> {
                                        const orderData = cartData.map(item =>{
                                            return {
                                                itemId : item.ItemId,
                                                quantity : item.Quantity
                                            }
                                        })

                                        OrderService.createOrder(props.userId, orderData)


                                        updateCartData([])
                                    }
                                }
                            />
                    }
                </div>
            </div>
        </>
    )
}

export default CustomerApp
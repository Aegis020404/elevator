import './App.css';
import {useEffect, useRef, useState} from "react";
if( !JSON.parse(localStorage.getItem('store')) ) {
    console.log('not working')
    localStorage.setItem('store', JSON.stringify([5]))
}
if(! JSON.parse(localStorage.getItem('activer')) )  localStorage.setItem('activer', JSON.stringify([1]));


console.log()


let working = JSON.parse(localStorage.getItem('store')).map(() => 0)

let brek = 0

function App() {
    useEffect(()=> {
        localStorage.setItem('store', JSON.stringify(elevater));
        localStorage.setItem('activer', JSON.stringify(active));


    })

    let [elevater, setElevater] = useState([...JSON.parse(localStorage.getItem('store'))])
    let [active, setActive] = useState([...JSON.parse(localStorage.getItem('activer'))])

    let wrap = useRef(false)
    let btns = useRef(false)
    const getShafts = () => <div className="tables" ref={wrap}>
        {elevater.map((n, i) => <div key={i} className="tables">
            {<div className="table">
                {getElevators(n)}
                <div className="active" style={{bottom: (elevater[i] >= active[i] ? active[i] - 1 : 0) * 100 + 'px'}}>
                    <div className='inactive'/>
                </div>
            </div>}
        </div>)}
    </div>
    const getElevators = n => {
        let arr = [];
        for (let i = 1; i <= n; i++) arr.push(i)
        return arr.map(i => {

            return <div key={i} className='data'/>
        })
    }
    const getButtons = () => {
        let arr = [];
        const max = Math.max(...elevater)
        for (let i = 1; i <= max; i++) arr.push(i)
        arr.reverse()
        return arr.map(i => <button mykey={i} key={i} className='btn'>{i}</button>)

    }
    const wrapMoveEl = el => {
        let index = 0
        let activeer = wrap.current.firstElementChild//firstElementChild.lastElementChild  //.nextElementSibling
        if (active.includes((+el.target.innerHTML))) return undefined
        for (let i = 0; i < elevater.length; i++)
            if (!working[i] && elevater[i] >= el.target.innerHTML) {
                if (active[i] === +el.target.innerHTML) return undefined
                index = i
                activeer = activeer.lastElementChild
                break;
            } else {
                activeer = activeer.nextElementSibling
            }


        moveEl(el, activeer, index)

    }
    const moveEl = (el, activeer, index) => {
        if (el.target.tagName !== 'BUTTON') return
        let h = el.target.innerHTML


        el.target.disabled = true;


        if (working[index]) {
            console.log(Math.abs(h - active[index]) * 1000 + 3000 + "        " + index)
            console.log(el.target)
            setTimeout(() => {
                wrapMoveEl(el)
            }, Math.abs(h - active[index]) * 1000 + 3000)
            return undefined
        }
        let activeTime = setInterval(() => {
            setActive((state) => {
                let initState = [...state]
                if (initState[index] > h) initState[index] = initState[index] - 1;
                if (initState[index] < h) initState[index] = initState[index] + 1;
                if (initState[index] === +h) clearInterval(activeTime)
                return [...initState]
            },)
        }, 1000)


        working[index] = 1

        setTimeout(function () {
            let timer = setInterval(() => {
                // try {


                let activeEr = activeer.lastElementChild
                // try{    activeEr.firstElementChild.style.background = '#00ff00'  } catch(e) {}
                if (brek % 2) {
                    activeEr.style.opacity = 1
                } else {
                    activeEr.style.opacity = 0.5
                }
                brek++
                if (brek >= 5) {
                    el.target.disabled = false

                    activeEr.firstElementChild.style.background = 'blueviolet'
                    brek = 0
                    activeEr.style.opacity = 1

                    clearInterval(timer)
                    working[index] = 0;
                }
                // } catch (e) {}

            }, 1000)
        }, (
            Math.abs(h - active[index]) * 1000
        )) //1000
    }

    function addLift (e) {
        if(+e.target.parentElement.firstElementChild.value < +e.target.parentElement.firstElementChild.nextElementSibling.value) {
            console.error('не реализуемая операция')
            return
        }
        setElevater((state)=>[...state,+e.target.parentElement.firstElementChild.value || 5])
        setActive((state)=>[...state,+e.target.parentElement.firstElementChild.nextElementSibling.value || 1])

    }
    function deleteLift (e) {
        let key = e.target.getAttribute('mykey')

        setElevater((state)=> state.filter((el,i)=>i !== + key))

        setActive((state)=> state.filter((el,i)=>i !== + key))


    }
    return (
        <div className="App">
            <div className="wrap" onClick={wrapMoveEl}>
                {getShafts()}
                <div className="btns" ref={btns}>
                    {getButtons()}
                </div>
            </div>
                <h3>В ведите колличество лифтов и на каком этаже они находятся </h3>
            <div className="settings">
                <div className="wrapLift">
                    {elevater.map((el, i)=> <div key={i}>{(i+1)} лифт <span>{el} этажей</span>  <span>{active[i]} этаж</span>  <button mykey={i} onClick={deleteLift} className='del'>удалить этаж</button></div> )}
                </div>
                <br/>
                <div className="innerSetting">
                    <input  type="text" placeholder={'колличество этажей'}   /> <input  type="text" placeholder={'начальный этаж'}   />   <button onClick={addLift} className='add'>Добавить ещё один лифт</button>
                </div>
            </div>
        </div>
    );
}

export default App;


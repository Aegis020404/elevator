import './App.css';
import {useRef, useState} from "react";
    let working = 0
    let brek = 0

function App() {
    let [elevater, setElevater] = useState([    5]  )
    let [active, setActive] = useState([    2,   ]  )
    let [efficiency, setEfficiency] = useState(elevater.map( el => true ) )
    console.log(efficiency);
    let wrap = useRef(false)
    const getShafts = () => <div className="tables" ref={wrap}>
        {elevater.map((n, i) => <div key={i} className="tables">
            {<div className="table">
                {getElevators(n)}
                <div className="active" style={{bottom: (elevater[i] >= active[i] ? active[i] - 1 : 0) * 100 + 'px' }}><div className='inactive'  /></div>
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
        return arr.map(i => <button key={i} className='btn'>{i}</button>)

    }
    const wrapMoveEl = el => {
        let index = 0
        let activeer = wrap.current.firstElementChild.firstElementChild.lastElementChild  //.nextElementSibling
        console.log(activeer)
        for (let i = 0; i < elevater.length; i++) {
            if(efficiency[i]) {
                index = i
            }
            console.log(i +'    ' + efficiency[i])
        }
        console.log(index)
        // .nextElementSibling
            // .lastElementChild
         moveEl(el,activeer,index)

    }
    const moveEl = (el, activeer,index) => {
        if (el.target.tagName !== 'BUTTON' ) return
            let h = el.target.innerHTML
        if (elevater[0] < h) return
        if (working) {

            setTimeout(()=> {
                moveEl(el)
            } ,Math.abs(h - active) * 1000 + 3000)

            return undefined
        }
        let activeTime = setInterval(() => {
        setActive((state)=> {
            let initState = [...state]
            if(initState[0] > h)  initState[0] = initState[0] - 1;
            if(initState[0] < h)  initState[0] = initState[0] + 1;
            if(initState[0] === +h)  clearInterval(activeTime)
            return [...initState]
        },)
        },1000)

        setEfficiency((state) =>{
            let initState = [...state]
            initState[index] = false
            return [...initState]
        } )

        working = 1
        setTimeout( function () {
            let timer = setInterval(() => {
                if(activeer.firstElementChild)  activeer.firstElementChild.style.background = '#00ff00'
                if (brek%2) {
                    activeer.style.opacity = 1
                } else {
                activeer.style.opacity = 0.5
                }
                brek++
                if(brek >= 5) {
                    activeer.firstElementChild.style.background = 'red'
                    brek = 0
                    activeer.style.opacity = 1
                    clearInterval(timer)
                    working = 0;
                }
            },600)
        },Math.abs(h - active)*1000)
    }
    return (
        <div className="App">
            <div className="wrap" onClick={wrapMoveEl} >
                {getShafts()}
                <div className="btns">
                    {getButtons()}
                </div>
            </div>
        </div>
    );
}

export default App;

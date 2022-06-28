import './App.css';
import {useEffect, useRef, useState} from "react";
    let store = [5 ,5,5,5]
    let working = store.map(()=>0)
    let brek = 0

function App() {
    let [elevater, setElevater] = useState([    ...store]  )
    let [active, setActive] = useState([    1,  1,1,1 ]  )

    let wrap = useRef(false)
    let btns = useRef(false)
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
        return arr.map(i => <button mykey={i} key={i} className='btn'>{i}</button>)

    }
    useEffect(()=>{
        // console.log(btns.current.children)
        //
        // console.log(active)
            console.log(    Array.from(  new Set(active)  )      )
        for(let elB of btns.current.children) {
                console.log(elB.getAttribute('mykey') )
            if(  Array.from(  new Set(active)  ).includes(elB.getAttribute('mykey')) ) {
                debugger
                elB.disabled = 'true';
            } else {
                elB.disabled = '';
            }
        }
    },[active])
    const wrapMoveEl = el => {
        let index = 0
        let activeer = wrap.current.firstElementChild//firstElementChild.lastElementChild  //.nextElementSibling
        for (let i = 0; i < elevater.length; i++)
            if( !working[i] && elevater[i] >= el.target.innerHTML) {
                if(active[i] === +el.target.innerHTML) return undefined
                index = i
                activeer = activeer.lastElementChild
                break;
            }   else {
                activeer = activeer.nextElementSibling
            }



         moveEl(el,activeer,index)

    }
    const moveEl = (el, activeer,index) => {
        if (el.target.tagName !== 'BUTTON') return
            let h = el.target.innerHTML
        if (elevater[0] < h) return
          try {
              // el.target.disabled = true
          } catch (e){}
        if (working[index]) {
            setTimeout(()=> {
                wrapMoveEl(el)
            } ,Math.abs(h - active) * 1000 + 3000)

            return undefined
        }
        let activeTime = setInterval(() => {
        setActive((state)=> {
            let initState = [...state]
            if(initState[index] > h)  initState[index] = initState[index] - 1;
            if(initState[index] < h)  initState[index] = initState[index] + 1;
            if(initState[index] === +h)  clearInterval(activeTime)
            return [...initState]
        },)
        },1000)


        working[index] = 1
        setTimeout( function () {
            let timer = setInterval(() => {
                let activeEr = activeer.lastElementChild
              try{    activeEr.firstElementChild.style.background = '#00ff00'  } catch(e) {}
                if (brek%2) {
                    try{         activeEr.style.opacity = 1 } catch(e) {}
                } else {
                    try{        activeEr.style.opacity = 0.5 }catch(e) {}
                }
                brek++
                if(brek >= 5) {
                    try{     activeEr.firstElementChild.style.background = 'red' } catch(e) {}
                    brek = 0
                        try{   activeEr.style.opacity = 1 } catch(e) {}
                    clearInterval(timer)
                    working[index] = 0;
                }
            },600)
        },Math.abs(h - active)*1000) //1000
    }
    return (
        <div className="App">
            <div className="wrap" onClick={wrapMoveEl} >
                {getShafts()}
                <div className="btns" ref={btns}>
                    {getButtons()}
                </div>
            </div>
        </div>
    );
}

export default App;

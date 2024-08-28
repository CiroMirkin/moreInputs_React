import React, { ComponentType, createContext, useContext, useEffect, useState } from "react"

export interface InputData {
    id: string
    content: string
}

const MoreInputsContext = createContext({ addInput: () => {}, ins: [], setIns: () => {} } as { addInput: () => void, ins: InputData[], setIns: any })


const testInputData: InputData[] = [
    {
      id: '1',
      content: 'pipi'
    },
    {
      id: '2',
      content: 'pupu'
    }
  ]

interface MoreInputsParams {
    children: React.ReactNode
    type?: 'text' | 'password' | 'number'
}

function MoreInputs({ children }: MoreInputsParams) {
    /** Lista con el contenido de los inputs */
    const [ inputs, setInputs ] = useState([...testInputData])
    /** Lista de componentes Input */
    const [inputList, setInputList] = useState([] as React.ReactNode[])

    /** Genera una lista con inputs */
    const renderInputs = () => {
        setInputList(
            inputs.map(({ id }) =>
                <div key={id}>
                    <Input id={id} />
                </div>
            )
        )
    }
    useEffect(renderInputs, [inputs.length])
    
    const addInput = () => {
        const newInput: InputData = {
            id: crypto.randomUUID(),
            content: ''
        }
        const newInputsData = [...inputs, {...newInput}]
        setInputs(newInputsData)
    }

    return (
        <>
            <MoreInputsContext.Provider value={{ addInput, setIns: setInputs, ins: inputs }} >
                { inputList }
                { children }
            </MoreInputsContext.Provider>
        </>
    )
}

export default MoreInputs

function AddInputBtn({ children }: { children?: React.ReactNode }) { 
    const btn = !!children ? children : <button>add</button>
    const addInput = useContext(MoreInputsContext).addInput
    return (
        <span onClick={addInput}>{ btn }</span>
    )
}

MoreInputs.AddInputBtn = AddInputBtn

function CustomInput<P>(Input: ComponentType<P>) {
    return (props: any) => <Input {...props} />
}

MoreInputs.CustomInput = CustomInput


interface InputParams {
    id: string
}

function Input({ id }: InputParams) {
    const { ins, setIns } = useContext(MoreInputsContext)

    const getInputValue = (): string => {
        return ins.filter(inputData => inputData.id === id)[0].content
    }

    const handleChange = (inputValue: string) => {
        const newIns = ins.map(inputData => {
            if(inputData.id === id) {
                return {
                    ...inputData,
                    content: inputValue
                }
            }
            return {...inputData}
        })

        console.table(newIns)
        setIns(newIns)
    }

    return(
        <input 
            id={id} 
            type="text" 
            value={getInputValue()} 
            onChange={e => handleChange(e.target.value)}
        />
    )
}
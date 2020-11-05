import React, { useState, useEffect } from "react"
import { Brands } from "../brands"
import { Authenticate } from "../authenticate"
import { MyAccount } from "../MyAccount"
import { Help } from "../Help"
import { Button, ButtonGroup, Navbar } from 'react-bootstrap'
import { Authentication } from "../../../shared/Controllers/Authentication"
import { FirebaseConfig } from "../../../shared/Controllers/FirebaseConfig"

type OnBackFunction = () => void

interface Props { 
}

enum Option {
  brands = "Brands",
  myAccount = "My Account",
  help = "Help",
  privacy = "Privacy",
  signOut = "Sign Out"
}

namespace Option {
    export function all(): Option[] {
        return [
            Option.brands,
            Option.myAccount,
            Option.help,
            Option.privacy,
            Option.signOut
        ]
    }

    export function element(option: Option, onBack: OnBackFunction, setChildOnBack: React.Dispatch<React.SetStateAction<OnBackFunction | null>>): JSX.Element | null {
         if (option == Option.brands) {
            return <Brands onBack={onBack} setChildOnBack={setChildOnBack}  />
         } else if (option == Option.myAccount) {
            return <MyAccount onBack={onBack} />
         } else if (option == Option.help) {
            return <Help onBack={onBack} />
         } else {
             return null
         }
    }
}

export function Main(props: Props): JSX.Element {
    FirebaseConfig.configure()

    const isLoggedIn = Authentication.isLoggedIn()

    if (isLoggedIn) {
        return <SignedInView></SignedInView>
    } else {
        return <Authenticate></Authenticate>
    }
}

function SignedInView(): JSX.Element {
    const [option, setOption] = useState<Option | null>(null)
    const [childOnBack, setChildOnBack] = useState<OnBackFunction | null>(null)
    
    console.log("childOnBack", childOnBack);
    const onBack = () => {
        console.log("childOnBack:", childOnBack);
        if (childOnBack) {
            childOnBack()
        } else {
            setOption(null)
        }
    };

    const options = Option.all().map( (option) => <Button onClick={() => setOption(option)} key={option}>{option.toString()}</Button>)

    let show: JSX.Element | null
    let navbar: JSX.Element | undefined
    
    if (!option) {
        show = <ButtonGroup vertical>{options}</ButtonGroup>
    } else {
        navbar = <Navbar fixed="top"><Button onClick={onBack}>Back</Button></Navbar> 
        show = Option.element(option, onBack, setChildOnBack)
    }

    return (
        <div className="bg-gray-200 flex items-center justify-center h-full w-full">
            {navbar}
            <div className="py-1"> 
                {show}
            </div>
        </div>
    )
}
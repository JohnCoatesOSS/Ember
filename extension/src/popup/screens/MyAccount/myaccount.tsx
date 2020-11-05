import React, { useState } from "react"

interface Props { 
    onBack: Function
}

export function MyAccount(props: Props) {
    return (
        <div className="bg-gray-200 flex items-center justify-center h-full w-full">
            <a href="#" onClick={() => props.onBack()}>Back</a>
            <div className="py-1"> 
            <a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Update Info</a>
            <a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Settings</a>
            </div>
        </div>
    )
}
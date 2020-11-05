import React, { useState, useEffect } from "react"
import { Button, ButtonGroup } from 'react-bootstrap'

enum Option {
    signIn = "Sign In",
    signUp = "Sign Up"
  }

export function Authenticate(): JSX.Element {
    return <SignedOutView></SignedOutView>
}

function SignedOutView(): JSX.Element {
    return (
        <div className="bg-gray-200 flex items-center justify-center h-full w-full">
            <ButtonGroup vertical>
                <Button key="signIn">Sign In</Button>
                <Button key="signUp">Sign Up</Button>
            </ButtonGroup>
        </div>
    )
}
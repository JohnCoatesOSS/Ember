import React, { useState, useRef, FormEvent } from "react"
import { Button, Form } from 'react-bootstrap'

type OnBackFunction = () => void

interface Props { 
    onBack: OnBackFunction
}

export function Help(props: Props): JSX.Element {
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const onSubmit = (event: FormEvent) => {
        console.log("submit", event)
        event.nativeEvent.preventDefault()
        console.log("current", inputRef.current)
        const input = inputRef.current
        if (!input) {
            return
        }
        console.log("message:", input.value)
        setFormSubmitted(true)
    }

    let bottom: JSX.Element
    if (formSubmitted) {
        bottom = <span>Help request sent</span>
    } else {
        bottom = <Button type="submit">Send</Button>
    }

    return (
        <Form onSubmit={(event) => onSubmit(event)}>
        <Form.Group controlId="emailInput">
            <Form.Label>Help request</Form.Label>
            <Form.Control type="text" placeholder="Message" ref={inputRef} />
        </Form.Group>
        {bottom}
    </Form>
    )
}
import React, { useState, useEffect, FormEvent, useRef } from "react"
import { Button, ButtonGroup, Form } from 'react-bootstrap'

type OnBackFunction = () => void

interface Props { 
    onBack: OnBackFunction,
    setChildOnBack: React.Dispatch<React.SetStateAction<OnBackFunction | null>>
}

enum Option {
    supportedBrands = "Supported Brands",
    requestABrand = "Request a Brand"
}
namespace Option {
    export function all(): Option[] {
        return [
            Option.supportedBrands,
            Option.requestABrand
        ]
    }

    export function render(option: Option): JSX.Element {
        switch (option) {
            case Option.supportedBrands:
                return <SupportedBrands></SupportedBrands>
            case Option.requestABrand:
                return <RequestABrand></RequestABrand>
        }
    }
}

export function Brands(props: Props): JSX.Element {
    const [option, setOption] = useState<Option | null>(null)
    const [childBack, setChildBack] = useState<OnBackFunction | null>(null)
    console.log("brands:option", option)

    let show: JSX.Element | null
    const setChildOnBack = props.setChildOnBack
    useEffect(() => {
        console.log("option", option)
        if (option) {
            setChildOnBack(() => () => setOption(null))
        } else {
            setChildOnBack(() => { return null })
        }
    }, [option, setChildOnBack])

    if (!option) {
        const options = Option.all().map( (option) => <Button onClick={() => setOption(option)} key={option}>{option.toString()}</Button>)
        show = (
            <ButtonGroup vertical>
                {options}
            </ButtonGroup>
        )
    } else {
        show = Option.render(option)
    }

    return show
}

function SupportedBrands(): JSX.Element {
    return (
        <span>Everlane</span>
    )
}

function RequestABrand(): JSX.Element {
    const [mailSent, setMailSent] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)
    // const mailSent = false
    const onSubmit = (event: FormEvent) => {
        console.log("submit", event)
        event.nativeEvent.preventDefault()
        console.log("current", inputRef.current)
        const brand = inputRef.current
        if (!brand) {
            return
        }
        console.log("brand:", brand.value)
        setMailSent(true)
    }

    let bottom: JSX.Element
    if (mailSent) {
        bottom = <span>Requested</span>
    } else {
        bottom = <Button type="submit">Request</Button>
    }

    return (
        <Form onSubmit={(event) => onSubmit(event)}>
            <Form.Group controlId="emailInput">
                <Form.Label>Brand name</Form.Label>
                <Form.Control type="text" placeholder="Brand name" ref={inputRef} />
            </Form.Group>
            {bottom}
        </Form>
    )
}
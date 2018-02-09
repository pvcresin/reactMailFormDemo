import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import autobind from 'autobind-decorator'
import ReactJson from 'react-json-view'

export default class App extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            text: '',
            result: {}
        }
    }
    @autobind
    editName(e) {
        this.setState({ name: e.currentTarget.value })
    }
    @autobind
    editText(e) {
        this.setState({ text: e.currentTarget.value })
    }
    @autobind
    submit() {
        // alert(`氏名: ${this.state.name} \n内容: ${this.state.text}`)
        const url = './sendContactMessage'
        fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                name: this.state.name,
                text: this.state.text
            })
        })
            .then(response => response.json())
            .then(json => {
                this.setState({ result: json })
            })
    }
    render() {
        return (
            <div>
                <p>
                    <label>name</label>
                    <input type='text' onChange={this.editName} />
                </p>
                <p>
                    <label>text</label>
                    <textarea onChange={this.editText}></textarea>
                </p>
                <button onClick={this.submit}>submit</button>
                <ReactJson src={this.state.result} />
            </div>
        )
    }
}
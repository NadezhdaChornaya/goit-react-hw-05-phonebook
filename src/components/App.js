import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import ContactForm from './contactForm/ContactForm';
import { ContactList } from './contactList/ContactList';
import { Filter } from './filter/Filter';
import { PhonebookWrapper } from './styledApp';
import { Notification } from './notifications/Notification';



const App = () => {
    const [state, setState] = useState({
        contacts: [
            { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
            { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
            { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
            { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
        ],
        filter: '',
    });

    const [alert, setAlert] = useState(false)
    const [text, setAlertText] = useState('')

    useEffect(() => {
        localStorage.setItem('contacts', JSON.stringify(state.contacts))
    }, [state.contacts])

    useEffect(() => {
        const localContacts = localStorage.getItem('contacts');
        if (localContacts) {
            setState((prev => (
                { ...prev, contacts: [...JSON.parse(localContacts)] }
            ))
            )
        }
    }, [])

    const getVisibleAlert = (text) => {
        setAlertText(text)
        setAlert(true);
        setTimeout(() => { setAlert(false) }, 2000)
        setTimeout(() => { (setAlertText('')) }, 2700)
    }

    const handleChangeFilter = (e) => {
        setState(prevState => ({ ...prevState, filter: e.target.value }));
    }

    const getVisibleContacts = () => {
        const { contacts, filter } = state;

        return contacts.filter((contact) =>
            contact.name.toLowerCase().includes(filter.toLowerCase())

        );
    };


    const addContact = (contactsObj) => {
        const contact = {
            id: uuidv4(),
            name: contactsObj.name,
            number: contactsObj.number,
        }
        if (!contactsObj.name.length) {

            getVisibleAlert('Please, enter your name')
        }
        else if (!contactsObj.number.length) {

            getVisibleAlert('Please, enter your number')
        }
        else {
            if (state.contacts.some((contact) =>
                contact.name.toLowerCase() === contactsObj.name.toLowerCase())) {

                getVisibleAlert(`${contactsObj.name} is already in contacts.`)
            }
            else {
                setState(prev => ({
                    ...prev, contacts: [...prev.contacts, contact]
                }))

            }

        }

    }

    const deleteContact = (e) => {
        const contactId = e.target.dataset.id
        setState(prevState =>
            ({ ...prevState, contacts: prevState.contacts.filter(({ id }) => id !== contactId) })
        )
    }
    return (

        <PhonebookWrapper>
            <CSSTransition
                in={alert}
                classNames="alertSlide"
                timeout={500}
                unmountOnExit
            >
                <Notification text={text} />
            </CSSTransition>
            <CSSTransition
                in={true}
                appear={true}
                classNames="titleSlide"
                timeout={500}
                unmountOnExit
            >
                <h1 className="mainTitle">Phonebook</h1>
            </CSSTransition>
            <ContactForm addContact={addContact} />
            <h2 className="title">Contacts</h2>

            <CSSTransition
                in={state.contacts.length > 1}
                classNames="filterSlide"
                timeout={500}
                unmountOnExit>
                <Filter value={state.filter} onChangeFilter={handleChangeFilter} />
            </CSSTransition>

            {state.contacts.length > 0 && (<CSSTransition
                in={true}
                appear={true}
                classNames="titleSlide"
                timeout={500}
                unmountOnExit>
                <ContactList contacts={getVisibleContacts()} deleteContact={deleteContact} />
            </CSSTransition>)}

        </PhonebookWrapper >

    )
}

export default App

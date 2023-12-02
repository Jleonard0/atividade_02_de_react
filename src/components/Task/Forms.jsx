import React, { useState, useEffect, useCallback } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { db } from '../../services/firebaseConnection'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'

export const NewTaskForm = (props) => {
    const [showForm, setShowForm] = useState(true);

    useEffect(() => {
        props.wrapperSetShowForm(showForm);
    }, [props.wrapperSetShowForm, showForm]);

    const onSubmit = async (event) => {
        event.preventDefault()
        try {
            const form = $(event.target)
            const taskName = form.find('input[name="taskName"]').val()
            const taskObs = form.find('input[name="taskObs"]').val()
            const taskStartDate = form.find('input[name="taskStartDate"]').val()
            const taskEndDate = form.find('input[name="taskEndDate"]').val()
            const docRef = await addDoc(
                collection(
                    db,
                    "tarefas"
                ),
                {
                    taskName: taskName,
                    taskObs: taskObs,
                    taskStartDate: taskStartDate,
                    taskEndDate: taskEndDate
                }
            )
            setShowForm(false)
        } catch (error) {
            alert("Tivemos um problema, por favor tente mais tarde.")
            console.log(error)
        }
    }

    return (
        <Form id={props.id} onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="formGroupTaskName">
                <Form.Label>Nome</Form.Label>
                <Form.Control name="taskName" type="text" placeholder="Nome" required={true} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupTaskObs">
                <Form.Label>Observações</Form.Label>
                <Form.Control name="taskObs" type="text" placeholder="Observações" required={true} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupTaskStartDate">
                <Form.Label>Data de início</Form.Label>
                <Form.Control name="taskStartDate" type="date" required={true} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupTaskEndDate">
                <Form.Label>Data de final</Form.Label>
                <Form.Control name="taskEndDate" type="date" required={true} />
            </Form.Group>
        </Form>
    )
}

export const ModalFormEditTask = (props) => {
    const [showForm, setShowForm] = useState(false)
    const handleClose = () => setShowForm(false)
    const handleShow = () => setShowForm(true)

    const wrapperSetShowForm = useCallback(
        val => {
            setShowForm(val)
        },
        [setShowForm]
    )

    return (
        <>
            <Button className='mx-1' variant="primary" onClick={handleShow}>
                Editar tarefa
            </Button>

            <Modal show={showForm} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar tarefa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormEditTask id={"formEditTask_"+props.task.id} task={props.task} showForm={showForm} wrapperSetShowForm={wrapperSetShowForm} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" form={"formEditTask_"+props.task.id}>
                        Adicionar
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export const FormEditTask = (props) => {
    const [showForm, setShowForm] = useState(true);

    useEffect(() => {
        props.wrapperSetShowForm(showForm);
    }, [props.wrapperSetShowForm, showForm]);

    const onSubmit = async (event) => {
        event.preventDefault()
        try {
            const form = $(event.target)
            const taskName = form.find('input[name="taskName"]').val()
            const taskObs = form.find('input[name="taskObs"]').val()
            const taskStartDate = form.find('input[name="taskStartDate"]').val()
            const taskEndDate = form.find('input[name="taskEndDate"]').val()
            const docRef = await updateDoc(
                doc(
                    db,
                    "tarefas",
                    props.task.id
                ),
                {
                    taskName: taskName,
                    taskObs: taskObs,
                    taskStartDate: taskStartDate,
                    taskEndDate: taskEndDate
                }
            )
            setShowForm(false)
        } catch (error) {
            alert("Tivemos um problema, por favor tente mais tarde.")
            console.log(error)
        }
    }

    return (
        <Form id={props.id} onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="formGroupTaskName">
                <Form.Label>Nome</Form.Label>
                <Form.Control name="taskName" type="text" defaultValue={props.task.taskName} placeholder="Nome" required={true} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupTaskObs">
                <Form.Label>Observações</Form.Label>
                <Form.Control name="taskObs" type="text" defaultValue={props.task.taskObs} placeholder="Observações" required={true} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupTaskStartDate">
                <Form.Label>Data de início</Form.Label>
                <Form.Control name="taskStartDate" type="date" defaultValue={props.task.taskStartDate} required={true} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupTaskEndDate">
                <Form.Label>Data de final</Form.Label>
                <Form.Control name="taskEndDate" type="date" defaultValue={props.task.taskEndDate} required={true} />
            </Form.Group>
        </Form>
    )
}
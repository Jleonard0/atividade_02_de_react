import React, { useState, useEffect, useCallback } from 'react'
import { Button, Modal, Form, ListGroup, Card } from 'react-bootstrap'
import { db } from '../../services/firebaseConnection'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { ModalFormEditTask, NewTaskForm } from './Forms'

const TaskView = (props) => {
    async function handleDelete(id, taskName) {
        try {
            await deleteDoc(doc(db, "tarefas", id))
                .then(() => {
                    alert('tarefa ' + taskName + ' removida com sucesso.')
                })
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <Card className='mt-2 mx-1' style={{ width: '18rem' }} as="li" id={props.task.id} key={props.task.id}>
            <Card.Body>
                <Card.Title>{props.task.taskName}</Card.Title>
                <Card.Text>
                    Objetivo: {props.task.taskObs}
                </Card.Text>
                <Card.Text>
                    data de início: {props.task.taskStartDate}
                </Card.Text>
                <Card.Text>
                    data final: {props.task.taskEndDate}
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <Button className='m-1' variant="danger" onClick={() => handleDelete(props.task.id, props.task.taskName)}>Remover</Button>
                <ModalFormEditTask task={props.task} />
            </Card.Footer>
        </Card>
    )
}

const TaskList = (props) => {
    const [alltaskList, setTaskList] = useState([])

    async function findAllTasks() {
        await getDocs(collection(db, "tarefas"))
            .then((snapshot) => {
                let taskList = []
                snapshot.forEach((doc) => {
                    taskList.push({
                        id: doc.id,
                        taskName: doc.data().taskName,
                        taskObs: doc.data().taskObs,
                        taskStartDate: doc.data().taskStartDate,
                        taskEndDate: doc.data().taskEndDate
                    })
                })
                setTaskList(taskList)
            })
    }

    useEffect(() => {
        findAllTasks()
    }, [alltaskList])

    var tasks = alltaskList.map(auxTask => <TaskView task={auxTask} />)

    return (
        <>
            <ListGroup as="ul" className='d-flex flex-row flex-wrap justify-content-around'>
                {tasks}
            </ListGroup>
        </>
    )
}

export const Task = () => {
    const [showForm, setShowForm] = useState(false)
    const handleClose = () => setShowForm(false)
    const handleShow = () => setShowForm(true)

    const wrapperSetShowForm = useCallback(
        val => {
            setShowForm(val)
        },
        [setShowForm]
    )

    async function deleteCollection(db, collectionPath, batchSize) {
        const collectionRef = db.collection(collectionPath);
        const query = collectionRef.orderBy('__name__').limit(batchSize);

        return new Promise((resolve, reject) => {
            deleteQueryBatch(db, query, resolve).catch(reject);
        });
    }

    return (
        <>
            <h2 className='mt-2'>Lista de tarefas</h2>
            <div>
                <Button className='mx-1' variant="primary" onClick={handleShow}>
                    Adicionar tarefa
                </Button>
            </div>

            <TaskList></TaskList>

            <Modal show={showForm} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar tarefa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewTaskForm id="formTask" showForm={showForm} wrapperSetShowForm={wrapperSetShowForm} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" form="formTask">
                        Adicionar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

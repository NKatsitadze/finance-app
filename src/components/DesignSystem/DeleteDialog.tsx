import Modal from "./Modal"
import Button from "./Button"

type deleteDialogProps = {
    title: string;
    closeHandler: () => void;
    deleteHandler: (title:string) => void;
}

export default function DeleteDialog ({ title, closeHandler, deleteHandler  }:deleteDialogProps) {
    return (
        <>
        <Modal title={`Delete '${title}'?`} onClose={closeHandler}>
            <p className="text-preset-4 text-grey-500">Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.</p>
            <Button label="Yes, Confirm Deletion" type="destroy" onButtonClick={() => deleteHandler(title)}/>
            <Button label="No, Go Back" type="tertiary" onButtonClick={closeHandler}/>
        </Modal>
        </>
    )
}
//
//  NotesView.ts
//
//  Generated by Poll Castillo on 09/03/2023.
//
import { Config } from "../../../Configs.js"
import { getEntityData, getEntitiesData, getFile } from "../../../endpoints.js"
import { CloseDialog, fixDate, renderRightSidebar } from "../../../tools.js"
import { InterfaceElement, InterfaceElementCollection } from "../../../types.js"
import { UIContentLayout, UIRightSidebar } from "./Layout.js"
import { UITableSkeletonTemplate } from "./Template.js"

// Local configs
const tableRows = Config.tableRows
let currentPage = Config.currentPage
const pageName = 'Notas'

const GetNotes = async (): Promise<void> => {
    const notes = await getEntitiesData('Note')
    return notes
}

export class Notes {
    private dialogContainer: InterfaceElement = document.getElementById('app-dialogs')
    private siebarDialogContainer: InterfaceElement = document.getElementById('entity-editor-container')
    private appContainer: InterfaceElement = document.getElementById('datatable-container')

    public render = async (): Promise<void> => {
        let notesArray: any = await GetNotes()
        this.appContainer.innerHTML = ''
        this.appContainer.innerHTML = UIContentLayout

        // Getting interface elements
        const viewTitle: InterfaceElement = document.getElementById('view-title')
        const tableBody: InterfaceElement = document.getElementById('datatable-body')

        // Changing interface element content
        viewTitle.innerText = pageName
        tableBody.innerHTML = UITableSkeletonTemplate.repeat(tableRows)

        // Exec functions
        this.load(tableBody, currentPage, notesArray)
        this.searchNotes(tableBody, notesArray)

        // Rendering icons
    }

    public load = (tableBody: InterfaceElement, currentPage: number, notes: any): void => {
        tableBody.innerHTML = '' // clean table

        // configuring max table row size
        currentPage--
        let start: number = tableRows * currentPage
        let end: number = start + tableRows
        let paginatedItems: any = notes.slice(start, end)

        // Show message if page is empty
        if (notes.length === 0) {
            let row: InterfaceElement = document.createElement('TR')
            row.innerHTML = `
            <td>No existen datos<td>
            <td></td>
            <td></td>
            `

            tableBody.appendChild(row)
        }
        else {
            for (let i = 0; i < paginatedItems.length; i++) {
                let note = paginatedItems[i] // getting note items
                let row: InterfaceElement = document.createElement('TR')
                row.innerHTML += `
                    <td>${note.title}</td>
                    <td>${note.content}</td>
                    <td id="table-date">${note.creationDate}</td>
                    <td>
                        <button class="button" id="entity-details" data-entityId="${note.id}">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </td>
                `
                tableBody.appendChild(row)
                this.previewNote(note.id)
                // TODO: Corret this fixer
                // fixDate()
            }
        }
    }

    private searchNotes = async (tableBody: InterfaceElement, notes: any) => {
        const search: InterfaceElement = document.getElementById('search')

        await search.addEventListener('keyup', () => {
            const arrayNotes: any = notes.filter((note: any) =>
                `${note.title}
                ${note.content}
                ${note.creationDate}`
                    .toLowerCase()
                    .includes(search.value.toLowerCase())
            )

            let filteredNotes = arrayNotes.length
            let result = arrayNotes

            if (filteredNotes >= Config.tableRows) filteredNotes = Config.tableRows

            this.load(tableBody, currentPage, result)

            // Rendering icons
        })
    }

    private previewNote = async (noteID: string): Promise<void> => {
        const openPreview: InterfaceElement = document.querySelectorAll('#entity-details')
        openPreview.forEach((preview: InterfaceElement) => {
            let currentNoteId = preview.dataset.entityid
            preview.addEventListener('click', (): void => {
                previewBox(currentNoteId)
            })
        })

        const previewBox = async (noteId: string): Promise<void> => {
            const note = await getEntityData('Note', noteId)

            renderRightSidebar(UIRightSidebar)
            const sidebarContainer: InterfaceElement = document.getElementById('entity-editor-container')
            const closeSidebar: InterfaceElement = document.getElementById('close')
            closeSidebar.addEventListener('click', (): void => {
                new CloseDialog().x(sidebarContainer)
            })
            // Note details
            const _details: InterfaceElementCollection = {
                picture: document.getElementById('note-picture-placeholder'),
                title: document.getElementById('note-title'),
                content: document.getElementById('note-content'),
                author: document.getElementById('note-author'),
                authorId: document.getElementById('note-author-id'),
                date: document.getElementById('creation-date'),
                time: document.getElementById('creation-time')
            }

            const image = await getFile(note.attachment)

            const noteCreationDateAndTime = note.creationDate.split('T')
            const noteCreationTime = noteCreationDateAndTime[1]
            const noteCreationDate = noteCreationDateAndTime[0]

            _details.title.innerText = note.title
            _details.content.innerText = note.content
            _details.author.value = `${note.user.firstName} ${note.user.lastName}`
            _details.authorId.value = note.createdBy
            _details.date.value = noteCreationDate
            _details.time.value = noteCreationTime

            if (note.attachment !== undefined) {
                _details.picture.innerHTML = `
                    <img id="note-picture" width="100%" class="note_picture margin_b_8" src="${image}">
                `
            }

        }
    }

    private closeRightSidebar = (): void => {
        const closeButton: InterfaceElement = document.getElementById('close')

        const editor: InterfaceElement = document.getElementById('entity-editor-container')

        closeButton.addEventListener('click', (): void => {
            new CloseDialog().x(editor)
        })
    }
}
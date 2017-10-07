import reducer from './manager'
import *as actions from '../actions/manager'

describe('manager reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(
            {
                projects: {
                    byId: {},
                    allIds: [],
                },
                filter: 'all',
                isFetching: false,
                targetProject: null,
                mode: 'home',
                currentPage: 0,
                maxPage: 3,
                canUpdatePage: false
            }
        )
    })

    it('should handle CHANGE_PROJECT_LIST_PAGE', () => {
        expect(
            reducer([], {
                type: actions.CHANGE_PROJECT_LIST_PAGE,
                payload: 1
            })
        ).toEqual(
            {
                currentPage: 1
            }
        )

        // expect(
        //     reducer(
        //         [
        //             {
        //                 text: 'Use Redux',
        //                 completed: false,
        //                 id: 0
        //             }
        //         ],
        //         {
        //             type: actions.SELECT_PROJECT_MENU,
        //             text: 'Run the tests'
        //         }
        //     )
        // ).toEqual([
        //     {
        //         text: 'Run the tests',
        //         completed: false,
        //         id: 1
        //     },
        //     {
        //         text: 'Use Redux',
        //         completed: false,
        //         id: 0
        //     }
        // ])
    })
})
import 'core-js/es6/array'
import 'core-js/es6/map'
import 'core-js/es6/set'
import 'regenerator-runtime/runtime'

import React from 'react'
import { render } from 'react-dom'
import { ReactTableDefaults } from 'react-table'
import ReactTable from 'react-table'
import { withTranslation } from 'react-i18next'
import i18n from './i18n'
import 'react-table/react-table.css'
import { getEvents } from './gcal'

const EventDetail = props => <div >{props.children}</div >
const searchFilter = (filter, row, column, field) => {
  const rgexp = new RegExp(filter.value, 'ig')
  if (field === 'zip' || field === 'city') {
    if (row['location.' + field + ''] !== undefined) {
      //console.log(row["location."+field+""],row)
      return (row['location.' + field + ''].search(rgexp) !== -1)
        ? true
        : false
    } else return false
  } else
    return (row._original[field].search(rgexp) !== -1) ? true : false
}

class App extends React.PureComponent {
  constructor (props) {
    super(props)
    const { t } = this.props;
    // Init Table-Layout
    Object.assign(ReactTableDefaults, {
      defaultPageSize: 10,
      minRows: 3,
      previousText: t('previousText'),
      nextText: t('nextText'),
      loadingText: t('loadingText'),
      noDataText: t('noDataText'),
      pageText: t('pageText'),
      rowsText: t('rowsText'),
      ofText: t('ofText'),
      className: '-striped -highlight',
      showPageJump: false,
      pageSizeOptions: [10, 25, 50, 100],
      filterable: true,
      defaultSorted: [
        {
          id: 'start',
          desc: false,
        }
      ],
    })
    this.state = {
      events: [],
      columns: [
        {
          Header: 'Zeitpunkt',
          accessor: 'start',
          width: 78,
          Cell: props => {
            return new Date(props.value).toLocaleString('de-DE',
              {year: 'numeric', month: '2-digit', day: '2-digit'}).
              split(',')[0]
          },
          filterMethod: (filter, row, column, field) => {
            return searchFilter(filter, row, column, 'start')
          },
        },
        {
          Header: 'Veranstaltung',
          accessor: 'title', // String-based value accessors!
          Cell: props => <div title={props.value} >{props.value}</div >,
          filterMethod: (filter, row, column, field) => {
            return searchFilter(filter, row, column, 'title')
          },
        },
        {
          Header: 'PLZ',
          accessor: 'location.zip',
          width: 50,
          Cell: props => {
            return (props.original.location.zip !== undefined)
              ? props.original.location.zip
              : ''
          },
          filterMethod: (filter, row, column, field) => {
            return searchFilter(filter, row, column, 'zip')
          },
        },
        {
          Header: 'Ort',
          accessor: 'location.city',
          width: 75,
          Cell: props => {
            return (props.original.location.city !== undefined)
              ? props.original.location.city
              : ''
          },
          filterMethod: (filter, row, column, field) => {
            return searchFilter(filter, row, column, 'city')
          },
        },
        {
          expander: true,
          Header: () => <strong >Details</strong >,
          width: 65,
          Expander: ({isExpanded, ...rest}) =>
            <div >
              {isExpanded
                ? <span >&#x2299;</span >
                : <span >&#x2295;</span >}
            </div >,
          style: {
            cursor: 'pointer',
            fontSize: 20,
            padding: '0',
            textAlign: 'center',
            userSelect: 'none',
          },
        },
      ],
    }

  }

  componentDidMount () {
    getEvents((events) => {
      this.setState({events})
    })
  }

  render () {
    if (this.state.events.length > 0) {
      return <ReactTable
        data={this.state.events}
        columns={this.state.columns}
        // Display Description as pure HTML
        SubComponent={
          row => <div style={{padding: '20px'}}
                      dangerouslySetInnerHTML={{__html: row.original.full.description}} />
        }
      />
    } else return <div ><p >No Calender-Entries in this Calendar</p ></div >
  }
}

const MyApp = withTranslation('common')(App)

render(
    <MyApp i18n={i18n}/>,
  document.getElementById('xst_googleEvents'))

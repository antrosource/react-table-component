import React from 'react'
import { PropTypes } from "prop-types";

import DesktopTable from './DesktopComponent'
import Pagination from './Pagination';
import Loader from '~/components/loader';

import './desktop.css';

class Table extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        loading: PropTypes.bool,
        data: PropTypes.arrayOf(PropTypes.any),
        showActiveCheckBox: PropTypes.bool,
        onActiveChanged: PropTypes.func,
        activeCheckValue: PropTypes.string
    }
    static defaultProps = {
        showSearch: true,
        data: []
    }
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            currentPage: 1
        }
    }
    dataPage = () => {
        const { data } = this.props;
        const paginate = (array, size, page) => {
            return array.slice((page - 1) * size, page * size);
        }
        const { pageSize, currentPage } = this.state;
        const pagedData = paginate(data, pageSize, currentPage);
        const pageOffset = (pageSize * (currentPage - 1)) + 1
        const pageEnd = (pageOffset + pagedData.length - 1);
        const pageSliceText = `${pageOffset} - ${pageEnd} of ${data.length} items`
        return { data: pagedData, pageSliceText }
    }
    changeCurrentPage = (delta) => {
        const dataLength = this.props.data.length;
        const totalPages = Math.ceil(dataLength / this.state.pageSize)
        if (dataLength <= 0) { return; }
        switch (delta) {
            case 'first': {
                this.setState({ currentPage: 1 });
                break
            }
            case 'last': {
                this.setState({ currentPage: totalPages });
                break
            }
            case 'previous': {
                let next = this.state.currentPage - 1;
                if (next <= 0) { next = 1 }
                this.setState({ currentPage: next });
                break
            }
            case 'next': {
                let next = this.state.currentPage + 1;
                if (next >= totalPages) { next = totalPages }
                this.setState({ currentPage: next });
                break
            }
        }
    }
    changePageSize = (value) => {
        const newSize = Number(value);
        this.setState({
            pageSize: newSize,
            currentPage: 1
        })
    }
    renderSearchBox(props) {
        const { showSearch,
            searchPlaceholder,
            searchLabel,
            searchText,
            onSearch,
            showActiveCheckBox,
            onActiveChanged,
            activeCheckValue
        } = props;

        if (!showSearch) { return null; }
        return <div className="input-group flex-nowrap">
            {showActiveCheckBox && (
                <span className="active-only"><input
                    type="checkbox"
                    name='isActive-checkbox'
                    label='Active Only'
                    groupClassName='form-check-input mt-0 mb-0'
                    checked={activeCheckValue}
                    onChange={event => onActiveChanged(event.target.checked)}
                />{`Active Only`}</span>
            )}
            <input
                type="text"
                className="form-control table-search"
                placeholder={searchPlaceholder}
                aria-label={searchLabel} aria-describedby="button-search"
                value={searchText}
                onChange={event => onSearch(event.target.value)}
            />
            <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="button" id="button-search"><i className="fa fa-search"></i></button>
            </div>
        </div>

    }
    renderShowAddButton(props) {
        if (!props.showAddButton) { return null }
        return (
            <button className="btn btn-rounded px-4 float-right" onClick={props.onAddClick}>
                <i className="fa fa-plus-circle"></i>&nbsp;{props.addLabel}
            </button>);
    }
    renderTable(props) {
        const page = this.dataPage()
        const { loading } = props;
        return (
            <div className="pt-table mt-1 p-2">
                <div className="row">
                    <div className="table-title col"><h1 className="display-3">{this.props.title}</h1></div>

                    <div className="col-6">
                        {this.renderSearchBox(props)}
                    </div>
                    <div className="col">
                        {this.renderShowAddButton(props)}
                    </div>

                </div>
                {
                    loading ? <Loader /> :
                        <>
                            <DesktopTable {...props} data={page.data} />
                            <Pagination
                                hide={page.data.length <= 0}
                                onChangePageSize={this.changePageSize}
                                onChangeCurrentPage={this.changeCurrentPage}
                                pageSliceText={page.pageSliceText}
                            />
                        </>
                }

            </div>);
    }
    render() {
        return <div className="container-fluid">
            {this.renderTable(this.props)}
        </div>

    }
}

export default Table;
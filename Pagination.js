import React from 'react'
import PropTypes from 'prop-types';

export default class Pagination extends React.PureComponent {
    static propTypes = {
        hide: PropTypes.bool,
        itemsPerPage: PropTypes.number,
        supportedPageSizes: PropTypes.arrayOf(PropTypes.number),
        onChangePageSize: PropTypes.func,
        onChangeCurrentPage: PropTypes.func,
        pageSliceText: PropTypes.string
    }
    static defaultProps = {
        itemsPerPage: 10,
        supportedPageSizes: [10, 25, 50, 100]
    }
    changeCurrentPage = (delta) => {
        const { onChangeCurrentPage } = this.props;
        if (typeof onChangeCurrentPage === 'function') {
            onChangeCurrentPage(delta)
        }
    }
    changePageSize = (event) => {
        const { onChangePageSize } = this.props;
        if (typeof onChangePageSize === 'function') {
            onChangePageSize(event.target.value)
        }
    }
    render() {
        const { supportedPageSizes, pageSliceText } = this.props;
        const pageSizes = [...new Set(supportedPageSizes)]; // this will remove duplicates
        const pageSizeOptions = pageSizes.map(size => {
            return <option key={size} value={size}>{size}</option>
        });
        if (this.props.hide) { return null; }
        return (
            <div>
                <div className="card-footer">
                    <div className="float-left">
                        <button type="button" disabled="" className="btn-pagination px-2" onClick={this.changeCurrentPage.bind(this, 'first')}>
                            <i className="fas fa-backward"></i>
                        </button>
                        <button type="button" disabled="" className="btn-pagination px-2" onClick={this.changeCurrentPage.bind(this, 'previous')}>
                            <i className="fas fa-step-backward"></i>
                        </button>
                        <button type="button" className="btn-pagination px-2" disabled="" onClick={this.changeCurrentPage.bind(this, 'next')}>
                            <i className="fas fa-step-forward"></i>
                        </button>
                        <button type="button" className="btn-pagination px-2" disabled="" onClick={this.changeCurrentPage.bind(this, 'last')}>
                            <i className="fas fa-forward"></i>
                        </button>
                        <select className="ml-4" onChange={this.changePageSize}>{pageSizeOptions}</select> items per page
                    </div>

                    <div className="page-indicator">{pageSliceText}</div>
                </div>
            </div>);
    }
}
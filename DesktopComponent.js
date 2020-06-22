import React from 'react'
import PropTypes from 'prop-types';

export default class DesktopTable extends React.PureComponent {
    static propTypes = {
        columns: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            field: PropTypes.string,
            width: PropTypes.number
        })),
        data: PropTypes.arrayOf(PropTypes.any)
    }
    constructor(props) {
        super(props);
        const { columns } = props;
        const originalTotalWidth = columns.reduce((a, b) => a.width + b.width);
        const columnsMap = {};
        columns.forEach(column => {
            const widthPercent = Math.floor((column.width / originalTotalWidth) * 100)
            columnsMap[column.field] = { ...column, widthPercent }
        })
        this.state = { columns, columnsMap }
    }
    renderHeaders = () => {
        const { columns } = this.state;

        return columns.map((column, index) => {
            const { field, title } = column;
            return (
                <th key={`th-${field}-${index}`} >
                    {title}
                </th>);
        })
    }
    renderBody = () => {
        const { data, columns } = this.props;
        if (data.length <= 0) { return <tr className="no-records"><td colSpan={columns.length}>No records found</td></tr> }

        const mapCells = (datum, rowKey) => {
            return columns.map((c) => {
                const key = `${rowKey}-${c.field}`;
                let renderItem;
                if (typeof c.cell === 'function') {
                    renderItem = c.cell({ data: datum });
                } else {
                    renderItem = datum[c.field]
                }
                return <td key={key}>{renderItem}</td>
            })
        }
        return data.map((datum, index) => {
            const key = `row-${index}`;
            return <tr key={key}>{mapCells(datum, key)}</tr>
        })
    }
    render() {
        return <table className="desk-table">
            <thead>
                <tr>{this.renderHeaders()}</tr>
            </thead>
            <tbody>
                {this.renderBody()}
            </tbody>
        </table>
    }
}
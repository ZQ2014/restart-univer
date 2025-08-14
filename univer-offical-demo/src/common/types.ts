// /**
//  * The filter types.
//  */
// export enum FilterBy {
//     VALUES,
//     COLORS,
//     CONDITIONS,
// }

// /**
//  * Data of a filter in a {@link Worksheet}.
//  *
//  * Please refer to 18.3.2 AutoFilter Settings. Properties of this interface would be added in the future.
//  * Please make sure that it is backward compatible.
//  *
//  * @property {IRange} ref The range of the filter.
//  * @property {IFilterColumn[]} [filterColumns] The filter criteria of each column.
//  * @property {number[]} [cachedFilteredOut] The cached filtered out row numbers.
//  */
// export interface IAutoFilter {
//     ref: IRange;

//     filterColumns?: IFilterColumn[];
//     cachedFilteredOut?: number[];
// }

export const selectStyles = {
    groupHeading: (provided: any) => ({
        ...provided,
        fontWeight: 'bold',
        color: '#333',
        backgroundColor: '#f7f7f7',
        padding: '10px 15px',
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        color: 'black',
        paddingLeft: state.isFocused || state.isSelected ? '25px' : '20px',
        backgroundColor: state.isFocused ? 'rgba(0, 123, 255, 0.1)' : 'white',
        fontWeight: state.isSelected ? 'bold' : 'normal',
    }),
    control: (provided: any) => ({
        ...provided,
        boxShadow: 'none',
        borderColor: '#ced4da'
    }),
    container: (provided: any) => ({
        ...provided,
        marginBottom: '20px'
    })
};
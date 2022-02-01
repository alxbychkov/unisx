export default function errorStatus(error = '', value = '') {
    switch (error) {
        case 'connect':
            return {isError: true, text: 'Подключение Metamask не удалось'};
        case 'mintTokensCount':
            return {isError: true, text: 'Недостаточно токенов коллатерала в кошельке для минтинга или пополнения коллатерала'};
        case 'mintGlobalRatio':
            return {isError: true, text: 'Недостаточно обеспечения (???)'};
        case 'mintSponsorTokens':
            return {isError: true, text: `Слишком маленькая позиция. Должна быть не менее ${value} sponsors tokens (???)`};
        case 'burnTokensCount':
            return {isError: true, text: 'Указано слишком большое количество синетиков для сжигания'};
        case 'withdrawCollateralCount':
            return {isError: true, text: 'Указано слишком большое количество токенов коллатерала для вывода'};
        case 'mintExpired':
            return {isError: true, text: 'Контракт в экспирации'};
        case 'poolTokensCount':
            return {isError: true, text: `Количество токенов ${value} превышает имеющееся в кошельке`};
        case 'unPoolTokensCount':
            return {isError: true, text: `Количество токенов ${value} превышает имеющееся в пуле`};
        case 'stakeTokensCount':
            return {isError: true, text: `Количество токенов ${value} превышает имеющееся в кошельке`};
        case 'unStakeTokensCount':
            return {isError: true, text: `Количество токенов ${value} превышает имеющееся в стейке`};
        case 'unStakeUNISXTokensCount':
            return {isError: true, text: `Количество токенов ${value} превышает имеющееся в кошельке количество токенов xUNISX`};
        case 'proccess':
            return {isError: false, text: 'Выполняется'};
        case 'failed':
            return {isError: true, text: 'Отказано'};
        case {isError: false, text: 'success'}:
            return 'Успешно';
        default:
            return '';
    }
}
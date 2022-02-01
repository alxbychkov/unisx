export default function errorStatus(error = '', value = '') {
    switch (error) {
        case 'connect':
            return 'Подключение Metamask не удалось';
        case 'mintTokensCount':
            return 'Недостаточно токенов коллатерала в кошельке для минтинга или пополнения коллатерала';
        case 'mintGlobalRatio':
            return 'Недостаточно обеспечения (???)';
        case 'mintSponsorTokens':
            return `Слишком маленькая позиция. Должна быть не менее ${value} sponsors tokens (???)`;
        case 'burnTokensCount':
            return 'Указано слишком большое количество синетиков для сжигания';
        case 'withdrawCollateralCount':
            return 'Указано слишком большое количество токенов коллатерала для вывода';
        case 'mintExpired':
            return 'Контракт в экспирации';
        case 'poolTokensCount':
            return `Количество токенов ${value} превышает имеющееся в кошельке`;
        case 'unPoolTokensCount':
            return `Количество токенов ${value} превышает имеющееся в пуле`;
        case 'stakeTokensCount':
            return 'Количество токенов ХХХ превышает имеющееся в кошельке';
        case 'unStakeTokensCount':
            return 'Количество токенов ХХХ превышает имеющееся в стейке';
        case 'unStakeUNISXTokensCount':
            return 'Количество токенов ХХХ превышает имеющееся в кошельке количество токенов xUNISX';
        case 'proccess':
            return 'Выполняется';
        case 'failed':
            return 'Отказано';
        case 'success':
            return 'Успешно';
        default:
            return '';
    }
}
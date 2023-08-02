export type Wallet = {
    id: string;
    mystic: Mystics[];
}

export type Mystics ={
    id: string;
    tokenID: number;
}


export type MysticResponse = {
    data: {
      wallet: Wallet;
    };
}

export type ErrorResponse ={
    errors: {
        message: string;
    }[];
}

class Money{
    private amount:number;
    private currency:string;

    constructor(amount:number,currency:string){
        this.amount=amount;
        this.currency=currency
    }
    function add(other:Money):void {
        if(this.currency!==other.currency){
            throw new error ("currency do not match")
        }

        
    }

}
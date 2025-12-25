
class InvoiceItem{
    private readonly unitprice: Money;
    private readonly quantity: number; 
    private readonly description:string;
    
    constructor(unitprice:Money, quantity:number, description:string){
        if(!description || description.trim().length===0){
            throw new Error("description is required")
        }
       
        if(!Number.isInteger(quantity) || quantity<=0){
            throw new Error("quantity must be a positive integer")
        }
        this.unitprice=unitprice;
        this.quantity=quantity;
        this.description=description;
    }   
    subtotal():Money{
        
        let totalAmount= new Money(0,this.unitprice.getCurrency());
        for(let i=0;i<this.quantity;i++){
            totalAmount=totalAmount.add(this.unitprice);
        }
        return totalAmount;

    }
    equals(other:InvoiceItem):boolean{
        return this.unitprice.equals(other.unitprice) && this.quantity===other.quantity&& this.description===other.description;
    }
}
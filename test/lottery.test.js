const assert    =   require('assert');
const ganache   =   require('ganache-cli');
const Web3      =   require('web3');

const web3      =   new Web3(ganache.provider());
let LotterySC   =   require('../build/contracts/Lottery.json');

let abi         =   LotterySC.abi;
let bytecode    =   LotterySC.bytecode;

let accounts;
let lottery;



beforeEach(async ()=>{

    // Get a list of all accounts
    accounts = await web3.eth.getAccounts()
    

    lottery = await new web3.eth.Contract(abi)
        .deploy({data:bytecode})
        .send({
            from:accounts[0],
            gas:'1000000',
        });

});


describe('Lottery Contract', () => {
    it('Deploys lottery contract',()=>{
        assert.ok(lottery.options.address);
    });


    it('Allow one account to enter',async()=>{
        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from:accounts[0]
        });

        assert.strictEqual(1,players.length);
    });


    it('Allow multiple accounts to enter',async()=>{
        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });

        await lottery.methods.enter().send({
            from:accounts[1],
            value: web3.utils.toWei('0.02','ether')
        });

        await lottery.methods.enter().send({
            from:accounts[2],
            value: web3.utils.toWei('0.02','ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from:accounts[0]
        });

        assert.strictEqual(accounts[0],players[0]);
        assert.strictEqual(accounts[1],players[1]);
        assert.strictEqual(accounts[2],players[2]);

        assert.strictEqual(3,players.length);
    });


    it('Requires a minimum amount of ether to enter',async()=>{
        try {
            await lottery.methods.enter().send({
                from:accounts[0],
                value:0
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });


    it('Only manager can pick winners',async()=>{
        try{
            await lottery.methods.pickWinner().send({
                from:accounts[1]
            })
            assert(false);
        } catch (error) {
            assert(error);
        }
    });


    it('Sends money to the winner',async()=>{
        try {
            await lottery.methods.enter().send({
                from:accounts[0],
                value: web3.utils.toWei('2','ether')
            });

            const initialBalance = await web3.eth.getBalance(accounts[0]);

            await lottery.methods.pickWinner().send({from:accounts[0]});

            const finalBalance = await web3.eth.getBalance(accounts);

            const difference = finalBalance - initialBalance;

            assert(difference > web3.utils.toWei('1.8','ether'));
            
        } catch (error) {
            assert(error);
        }
    })
})


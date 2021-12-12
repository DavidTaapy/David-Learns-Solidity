const { expect } = require('chai');

describe('Token contract', () => {
    let Token, token, owner, addr1, addr2;

    beforeEach (async () => {
        Token = await ethers.getContractFactory('Token');
        token = await Token.deploy();
        [owner, addr1, addr2, _] = ethers.getSigners();
    });

    describe('Deployment', () => {
        it('Should set the right owner', async () => {
            expect(await token.owner()).to.equal(owner.address);
        });

        it('Should assign the total supply of token to the owners', async () => {
            const ownerBalance = token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe('Transactions', () => {
        it('Should transfer tokens between accounts', async () => {
            await token.transfer(addr1.address, 25);
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(25);
            await token.transfer(addr2.address, 44);
            const addr2Balance = await token.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(44);
        });
    });
});
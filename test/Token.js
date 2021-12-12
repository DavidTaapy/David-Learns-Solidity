const { expect } = require('chai');

describe('Token contract', () => {
    let Token, token, owner, addr1, addr2;

    beforeEach(async () => {
        Token = await ethers.getContractFactory('Token');
        token = await Token.deploy();
        [owner, addr1, addr2, _] = await ethers.getSigners();
    });

    describe('Deployment', () => {
        it('Should set the right owner', async () => {
            expect(await token.owner()).to.equal(owner.address);
        });

        it('Should assign the total supply of token to the owners', async () => {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe('Transactions', () => {
        it('Should transfer tokens between accounts', async () => {
            await token.transfer(addr1.address, 25);
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(25);
            // Transfer to address 2 from address 1 a sum of 16 tokens
            await token.connect(addr1).transfer(addr2.address, 16);
            const addr2Balance = await token.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(16);
        });

        it('Should fail if sender does not have tokens', async () => {
            const initialBalanceOwner = await token.balanceOf(owner.address);
            await expect(
                token.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith('Not enough tokens');
            expect(
                await token.balanceOf(owner.address)
            ).to.equal(initialBalanceOwner);
        });

        it('Should update post-transfer balances', async () => {
            const initialBalanceOwner = await token.balanceOf(owner.address);
            await token.transfer(addr1.address, 9);
            await token.transfer(addr2.address, 16);
            const finalOwnerBalance = await token.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialBalanceOwner - 25);
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(9);
            const addr2Balance = await token.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(16);
        });
    });
});